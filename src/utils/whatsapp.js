export const WHATSAPP_PHONE = "919322513396";

export function getFullProposalWhatsAppUrl(quizAnswers = {}, proposalTries = 0) {
  const lines = [
    "OMG HO! 💗💍",
    "",
    "💖 *Tu Mazi Girlfriend Hoshil Ka?* 👉 *HO!*",
    proposalTries > 0
      ? `🙈 ('Nako' var ${proposalTries} vela click karaycha prayatna kela, pan button palun gela!)`
      : "🥰 (Lagech HO bolli!)",
    "",
    "📋 *Mazi Sagli Answers:*",
    ...Object.entries(quizAnswers)
      .filter(([q]) => q !== "proposal")
      .map(([q, a]) => `✨ ${q} 👉 *${a}*`),
    "",
    "Officially tuzich forever! 🧡🎉",
  ];
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
}
