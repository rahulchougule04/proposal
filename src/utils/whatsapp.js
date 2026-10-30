export const WHATSAPP_PHONE = "919322513396";

export function getFullProposalWhatsAppUrl(quizAnswers = {}, proposalTries = 0) {
  const lines = [
    "OMG YES! 💗💍",
    "",
    "💖 *Kya Tum Meri Girlfriend Banogi?* 👉 *YES!*",
    proposalTries > 0
      ? `🙈 (Tried to click 'No' ${proposalTries} time${proposalTries > 1 ? "s" : ""}, but the button ran away!)`
      : "🥰 (Said YES right away!)",
    "",
    "📋 *All My Answers:*",
    ...Object.entries(quizAnswers)
      .filter(([q]) => q !== "proposal")
      .map(([q, a]) => `✨ ${q} 👉 *${a}*`),
    "",
    "Officially yours forever! 🧡🎉",
  ];
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
}
