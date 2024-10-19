if [ ! -f "./ssh/id_rsa.pem" ]; then
  ssh-keygen -t rsa -b 4096 -m PEM -N "" -f ./ssh/id_rsa
  openssl rsa -in ./ssh/id_rsa -outform PEM -out ./ssh/id_rsa.pem
fi