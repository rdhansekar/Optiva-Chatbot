sudo docker buildx build -t optiva . -f /home/azureadmin/OptivaServer/AppServer-Test/Dockerfile.optiva

sudo docker buildx build -t optiva-prod . -f /home/azureadmin/OptivaServer/AppServer-Prod/Dockerfile.optiva

sudo docker buildx build -t qna . -f /home/ubuntu/question_answer_chatbot/app/dockerfile.qna

sudo docker ps
#get container id of qna prod
sudo docker stop #containerid
sudo docker run --rm -d -p 8001:8001 qna:latest

##production push
cd ../../devops
sudo docker tag optiva-prod:latest vizualcontainer470.azurecr.io/optiva:1.3.4
sudo docker push vizualcontainer470.azurecr.io/optiva:1.3.4
vi charts/optiva/Chart.yaml


##update Chart.yml with latest version
vi devops/chats/
cd ../../devops
git pull 
make optiva

sudo docker run -d python 
sudo docker run -d -p 8000:8000 rasa/duckling 
sudo docker run -d -p 8080:8080 vizual-nlp:latest 
sudo docker run -d -p 3000:3000 vizual-nlp-bkp:latest 
sudo docker ps
sudo docker stop


sudo docker run --rm -d -p 80:80 optiva:latest