import os
import sys
import json
import requests

def transcribe(audio_path):
    # Pega a chave da API das variáveis de ambiente
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        print("❌ Erro: A variável de ambiente GROQ_API_KEY não foi encontrada.")
        print("Crie sua chave grátis em: https://console.groq.com/")
        print("Uso no terminal: GROQ_API_KEY='sua_chave' python3 transcribe.py <caminho_do_audio.mp3>")
        sys.exit(1)
        
    url = "https://api.groq.com/openai/v1/audio/transcriptions"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    print(f"⏳ Enviando '{audio_path}' para o Whisper via Groq API...")
    
    try:
        with open(audio_path, "rb") as f:
            files = {"file": (os.path.basename(audio_path), f)}
            data = {
                "model": "whisper-large-v3",
                "response_format": "verbose_json",
                "timestamp_granularities[]": "word",
                "language": "pt",
            }
            response = requests.post(url, headers=headers, files=files, data=data)
            
            if response.status_code != 200:
                print(f"❌ Erro na API: HTTP {response.status_code} - {response.text}")
                sys.exit(1)
                
            raw_data = response.json()
            
            # Formata para a estrutura limpa
            result = [
                {
                    "word": item["word"].strip(),
                    "start": round(item["start"], 3),
                    "end": round(item["end"], 3),
                }
                for item in raw_data.get("words", [])
            ]
            
            # Salva com o mesmo nome do áudio, mas .json
            base_path = os.path.splitext(audio_path)[0]
            output_file = f"{base_path}_words.json"
            
            with open(output_file, "w", encoding="utf-8") as out_f:
                json.dump(result, out_f, ensure_ascii=False, indent=2)
                
            print(f"✅ Mapeamento concluído com sucesso!")
            print(f"✅ Arquivo salvo em: {output_file}")
            
    except Exception as e:
        print(f"❌ Erro ao processar o arquivo: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python3 transcribe.py <caminho_do_audio.mp3>")
        sys.exit(1)
        
    audio_path = sys.argv[1]
    if not os.path.exists(audio_path):
        print(f"❌ Arquivo não encontrado: {audio_path}")
        sys.exit(1)
        
    transcribe(audio_path)
