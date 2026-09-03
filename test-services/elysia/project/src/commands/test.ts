export default async function handle(args: string[]) {
  console.log("👋 Olá! Este é o comando especial hello rodando no Elysia/Bun!");
  
  if (args.length > 0) {
    console.log("📦 Você passou os seguintes parâmetros adicionais:");
    args.forEach((arg, index) => {
      console.log(`   ${index + 1}. ${arg}`);
    });
    
    // Pequeno exemplo bacana de como tratar uma flag "--force"
    if (args.includes("--force")) {
      console.log("⚠️ AVISO: A flag --force foi detectada! Modo agressivo ativado.");
    }
  } else {
    console.log("🤷 Nenhum parâmetro extra foi passado. (Tente rodar com alguns argumentos!)");
  }
  
  console.log("✅ Comando finalizado com sucesso.");
}
