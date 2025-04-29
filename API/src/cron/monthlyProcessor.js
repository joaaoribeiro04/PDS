/* eslint-disable no-undef */
const nodeCron = require("node-cron");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = (app) => {
  nodeCron.schedule("0 0 28-31 * *", async () => {
    const today = new Date();
    const lastDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    if (today.getDate() !== lastDay) return;

    // Obter as despesas do mês
    const gastos = await app.services.gastos.getAll();
    if (!gastos || gastos.length === 0) return;

    // Obter os residentes
    const residentes = await app.services.user.getAll();
    const gastosDoMes = gastos.filter(
      (g) => new Date(g.data).getMonth() === today.getMonth()
    );

    for (const residente of residentes) {
      const gasto = gastosDoMes[Math.floor(Math.random() * gastosDoMes.length)];

      // Calcular o total da fatura
      const fatura = {
        id_residente: residente.id,
        id_gastos: gasto.id,
        total: gasto.agua + gasto.luz + gasto.gas + gasto.outros,
        data_emissao: today.toISOString().split("T")[0],
        data_limite: new Date(today.getFullYear(), today.getMonth() + 1, 10)
          .toISOString()
          .split("T")[0],
        status: "pendente",
      };

      // Salvar a fatura no banco de dados
      const novaFatura = await app.services.faturas.save(fatura);
      console.log("Fatura criada:", novaFatura);

      // Enviar fatura por e-mail para o residente
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: residente.email,
        subject: "Sua Fatura Mensal",
        text: `Olá ${residente.nome},\n\nSua fatura do mês está disponível. O valor total é: €${fatura.total}.`,
      });
      console.log(`Fatura enviada para ${residente.email}`);

      // Verificar pagamento e enviar notificação de cobrança se necessário
      if (
        fatura.status === "pendente" &&
        new Date(fatura.data_limite) < new Date()
      ) {
        await transporter.sendMail({
          from: process.env.MAIL_USER,
          to: residente.email,
          subject: "Aviso de Cobrança - Fatura Pendente",
          text: `Sua fatura com vencimento em ${fatura.data_limite} ainda não foi paga. Por favor, regularize sua situação.`,
        });
        console.log(`Cobrança enviada para ${residente.email}`);
      }
    }

    // Gerar e enviar relatório financeiro mensal
    await gerarRelatorioEEnviar(app, gastosDoMes);
  });
};

// Função para gerar o relatório financeiro e enviar por e-mail para os administradores
async function gerarRelatorioEEnviar(app, gastos) {
  const pdfPath = path.join(__dirname, "../relatorio_financeiro.pdf");

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfPath));

  doc.fontSize(18).text("Relatório Financeiro Mensal", { align: "center" });
  doc.moveDown();

  let total = { agua: 0, luz: 0, gas: 0, outros: 0 };
  gastos.forEach((g) => {
    total.agua += g.agua;
    total.luz += g.luz;
    total.gas += g.gas;
    total.outros += g.outros;
  });

  doc.fontSize(12).text(`Total Água: €${total.agua}`);
  doc.text(`Total Luz: €${total.luz}`);
  doc.text(`Total Gás: €${total.gas}`);
  doc.text(`Total Outros: €${total.outros}`);
  doc.text(
    `Total Geral: €${total.agua + total.luz + total.gas + total.outros}`
  );
  doc.end();

  // Enviar relatório para os administradores
  const admins = await app.services.role.getAdmins();
  const adminUsers = await Promise.all(
    admins.map((a) => app.services.user.getById({ id: a.user_id }))
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  for (const admin of adminUsers) {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: admin.email,
      subject: "Relatório Financeiro Mensal",
      text: "Segue em anexo o relatório financeiro mensal.",
      attachments: [
        {
          filename: "relatorio_financeiro.pdf",
          path: pdfPath,
        },
      ],
    });

    console.log(`Relatório enviado para ${admin.email}`);
  }
}
