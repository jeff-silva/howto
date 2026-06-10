from transformers import pipeline

def gerar_piada():
    gerador_texto = pipeline('text-generation', model='distilgpt2')
    piada = gerador_texto("Por que o pintinho atravessou a rua?", max_length=50, num_return_sequences=1)[0]['generated_text']
    return piada

piada = gerar_piada()
print(piada)

piada = gerar_piada()
print(piada)

piada = gerar_piada()
print(piada)