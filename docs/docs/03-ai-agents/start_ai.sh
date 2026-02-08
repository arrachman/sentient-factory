#!/bin/bash

# Konfigurasi Performa M1 32GB
export OLLAMA_NUM_PARALLEL=4
export OLLAMA_MAX_LOADED_MODELS=4
export OLLAMA_FLASH_ATTENTION="1"
export OLLAMA_KV_CACHE_TYPE="q8_0"

echo "=== Menu Pilih Model AI Lokal ==="
echo "1) DeepSeek-R1 8B (Logika Kuat)"
echo "2) Llama 3.1 8B (Support Tools/Mode Build)"
echo "3) Phi-3 (Sangat Cepat/Ringan)"
echo "4) Dolphin Llama 3 (Support Tools/Mode Build)"
echo "5) Llama 2 Uncensored 8B (Serbaguna)"
echo "6) GPT4All-J 8B (Percakapan Umum)"
echo "7) Mistral 7B Instruct (Instruktur Serbaguna)"
echo "8) Guanaco 7B (Percakapan Alami)"
echo "9) Vicuna 7B (Percakapan Alami)"
echo "10) Airoboros 7B (Percakapan Alami)"
echo "11) Falcon 7B Instruct (Instruktur Serbaguna)"
echo "12) WizardLM 7B (Instruktur Serbaguna)"
echo "13) Stable Vicuna 13B (Percakapan Alami)"
echo "14) Llama 2 13B (Serbaguna)"
echo "15) Mistral 7B (Serbaguna)"
echo "16) GPT4All 13B Snow (Percakapan Umum)"
echo "17) GPT4All 13B (Percakapan Umum)"
echo "18) Falcon 40B Instruct (Instruktur Kuat)"
echo "19) Llama 2 70B (Serbaguna)"
echo "20) GPT4All 70B (Percakapan Umum)"
echo "==============================="
read -p "Pilih nomor (1-20): " choice

case $choice in
  1) MODEL="deepseek-r1:8b" ;; # Ram=8GB vCPU=4
  2) MODEL="llama3.1:8b" ;; # Ram=8GB vCPU=4
  3) MODEL="phi3" ;; # Ram=4GB vCPU=2
  4) MODEL="dolphin-llama3" ;; # Ram=8GB vCPU=4 isUncensored
  5) MODEL="llama2-uncensored" ;; # Ram=8GB vCPU=4 isUncensored
    6) MODEL="gpt4all-j" ;; # Ram=8GB vCPU=4
    7) MODEL="mistral-7b-instruct" ;; # Ram=8GB vCPU=4
    8) MODEL="guanaco-7b" ;; # Ram=8GB vCPU=4
    9) MODEL="vicuna-7b" ;; # Ram=8GB vCPU=4 isUncensored
    10) MODEL="airoboros-7b" ;; # Ram=8GB vCPU=4 isUncensored
    11) MODEL="falcon-7b-instruct" ;; # Ram=8GB vCPU=4
    12) MODEL="wizardlm-7b" ;; # Ram=8GB vCPU=4 isUncensored
    13) MODEL="stable-vicuna-13b" ;; # Ram=13GB vCPU=4
    14) MODEL="llama2-13b" ;; # Ram=13GB vCPU=4
    15) MODEL="mistral-7b" ;; # Ram=7GB vCPU=4
  16) MODEL="gpt4all-13b-snow" ;; # Ram=13GB vCPU=4
  17) MODEL="gpt4all-13b" ;; # Ram=13GB vCPU=4
  18) MODEL="falcon-40b-instruct" ;; # Ram=40GB vCPU=8
  19) MODEL="llama2-70b" ;; # Ram=70GB vCPU=8
  20) MODEL="gpt4all-70b" ;; # Ram=70GB vCPU=8  
  *) MODEL="deepseek-r1:8b" ;;
esac

echo "Sedang menjalankan Server Ollama dan memuat model: $MODEL..."

# Menjalankan server di background dan langsung menjalankan model
ollama serve & sleep 5 && ollama run $MODEL