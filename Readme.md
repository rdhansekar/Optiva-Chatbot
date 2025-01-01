Optiva - AI Smart Catalog 

GitHub Repository:
	https://github.com/Vizual-Platform/Optiva-Chatbot

Two images:

Vizual NLP
Image names/ Docker commands
sudo docker run -d python 
sudo docker build -t vizual-nlp
sudo docker run -d -p 8000:8000 rasa/duckling
sudo docker run -d -p 8080:8080 vizual-nlp:latest 
sudo docker run -d -p 3000:3000 vizual-nlp-bkp:latest
sudo docker container stop <container-name>

Chatbot server and UI
Image names/ Docker commands

sudo docker buildx build -t optiva . -f <path>/Dockerfile.optiva
sudo docker run --rm -d -p 80:80 optiva

How to train NLP using YAML file - Relevant to Ganesh:

Stop the container and delete the image and container 
Go to rasa-chatbot folder 
In the data folder , change the nlu.yml file.
build the image using : sudo docker build -t vizual-nlp .
make sure rasa-ducking server is running on port 8000, if not run it using this command : sudo docker run -d -p  --network rasa-network 8000:8000 rasa/duckling
run the image using sudo docker run -d -p 3000:3000 --network rasa-network vizual-nlp:latest

Connecting to customer’s GCloud machine:
gcloud auth activate-service-account iap-user@gen-ai-bss-demo.iam.gserviceaccount.com --key-file=<JSON file path> --project "gen-ai-bss-demo"
8:01
gcloud compute ssh --zone "europe-west2-a" "gen-ai-demo-vm" --tunnel-through-iap --project "gen-ai-bss-demo"
