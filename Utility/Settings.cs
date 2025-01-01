using CommonUtility;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Optiva
{
    public class Settings
    {
        public static string MongoConnectionString;
        public static int MaxConnectionPool;
        public static int MaxWaitQueueSize;
        public static MongoDbUtility mongoUtility;
        public static bool UseConnectionPooling;
        public static string Mongdbname;
        public static string ReadNodeTagName;
        public static IConfigurationSection _configuration;
        public static string EmailUsername;
        public static string EmailPassword;
        public static string EmailFrom;
        public static int EmailPort;
        public static string EmailSmtpHost;
        public static string BaseUrl;
        public static string IpDetailsURL;
        public static string BccEmailAddress;
        public static string notifyEmailAddress;
        public static string S3Bucket;
        public static string SecretKey;
        public static string AccessKey;
        public static string FTPPath;
        public static string FTPUserName;
        public static string FTPPassword;
        public static string FTPDownloadPath;
        public static string ShipmentAPIKey;
        public static string ShipmentAPISecret;
        public static string ShipmentServerUrl;
        public static string ShipmentAuthCode;
        public static string BrandName;
        public static int PaymentGateway;
        public static string SharepointTenantId;
        public static string SharepointClientId;
        public static string SharepointClientSecret;
        public static string NLPServerAddress = "https://genai-demo.optiva.com:3000";
        public static string GenAIServerURL;
        public static string HMACSecret { get; internal set; }
        public static string GenAIKey { get; internal set; } = "f3a09f4c4714422b9550799bfd069c47";

        public Settings(IConfiguration configuration)
        {
            _configuration = configuration.GetSection("AppSettings");
            ShipmentAPIKey = ReadStringValueFromConfig("ShipmentAPIKey", "");
            ShipmentAPISecret = ReadStringValueFromConfig("ShipmentAPISecret", "");
            ShipmentServerUrl = ReadStringValueFromConfig("ShipmentServerUrl", "");
            ShipmentAuthCode = "Basic " + Utility.StringToBase64(ShipmentAPIKey + ":" + ShipmentAPISecret);
            MongoConnectionString = ReadStringValueFromConfig("MongoConnectionString", "mongodb://127.0.0.1:27017");
            MaxConnectionPool = ReadIntValueFromConfig("MaxConnectionPool", 100);
            MaxWaitQueueSize = ReadIntValueFromConfig("MaxWaitQueueSize", 500);
            S3Bucket = ReadStringValueFromConfig("S3Bucket", "");
            SecretKey = ReadStringValueFromConfig("SecretKey", "");
            AccessKey = ReadStringValueFromConfig("AccessKey", "");
            FTPPath = ReadStringValueFromConfig("FTPPath", "ftp://127.0.0.1");
            FTPUserName = ReadStringValueFromConfig("FTPUserName", "");
            FTPPassword = ReadStringValueFromConfig("FTPPassword", "");
            FTPDownloadPath = ReadStringValueFromConfig("FTPDownloadPath", "http://localhost/");
            UseConnectionPooling = ReadBooleanValueFromConfig("UseConnectionPooling", false);
            Mongdbname = ReadStringValueFromConfig("Mongdbname", "lasignsdb");
            ReadNodeTagName = ReadStringValueFromConfig("ReadNodeTagName", "ELECTABLE");
            EmailUsername = ReadStringValueFromConfig("EmailUsername", "contact@nlshelp.com");
            EmailPassword = ReadStringValueFromConfig("EmailPassword", "uouvrwmlcsfqdxpv");
            EmailFrom = ReadStringValueFromConfig("EmailFrom", "contact@nlshelp.com");
            EmailPort = ReadIntValueFromConfig("EmailPort", 587);
            EmailSmtpHost = ReadStringValueFromConfig("EmailSmtpHost", "smtp.gmail.com");
            BaseUrl = ReadStringValueFromConfig("BaseUrl", "https://localhost:44342");
            IpDetailsURL = ReadStringValueFromConfig("IpDetailsURL", "https://api.ipregistry.co/{0}?key=uf27y7o4azyh7z");
            HMACSecret = ReadStringValueFromConfig("HMACSecret", "dc5264a38ed2ed059e7f260f0145806e56c909da6941e00d757f9febc91750ae");
            NLPServerAddress = ReadStringValueFromConfig("NLPServerAddress", "https://genai-demo.optiva.com:8080");
            GenAIServerURL = ReadStringValueFromConfig("GenAIServerURL", "https://optivagenai.openai.azure.com/openai/deployments/OptivaAI16k/chat/completions?api-version=2024-02-15-preview");
            GenAIKey = ReadStringValueFromConfig("GenAIKey", "f3a09f4c4714422b9550799bfd069c47");
            mongoUtility = new MongoDbUtility();
            mongoUtility.SetMongoConnectionSettings(Settings.MongoConnectionString, Settings.MaxConnectionPool,
                                                        Settings.MaxWaitQueueSize, Settings.ReadNodeTagName,
                                                        Settings.Mongdbname, Settings.UseConnectionPooling);


            SharepointTenantId = ReadStringValueFromConfig("SharepointTenantId", "fb41c201-9ae3-40d2-8128-6591bb13c5f3");
            SharepointClientId = ReadStringValueFromConfig("SharepointClientId", "04132226-b443-4fdf-9b16-261dba3d2498");
            SharepointClientSecret = ReadStringValueFromConfig("SharepointClientSecret", "z8V8Q~hfrO-bY54014HKiXbyv1nXfzNCNwB1za02");
            EmailFrom = ReadStringValueFromConfig("EmailFrom", "contact@nlshelp.com");
            BccEmailAddress = ReadStringValueFromConfig("BccEmailAddress", "evelyne@nlstechnology.com,ulysses@nlstechnology.com");
            notifyEmailAddress = ReadStringValueFromConfig("notifyEmailAddress", "ulysses@nlstechnology.com,evelyne@nlstechnology.com,manasaprakash8@gmail.com");
            BrandName = ReadStringValueFromConfig("BrandName", "");
        }


        private static bool ReadBooleanValueFromConfig(string name, bool defaultVal)
        {
            try
            {
                string val = ReadStringValueFromConfig(name, "");
                if (!string.IsNullOrWhiteSpace(val))
                {
                    return bool.Parse(val);
                }
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return defaultVal;
        }


        private static int ReadIntValueFromConfig(string name, int defaultVal)
        {
            try
            {
                string val = ReadStringValueFromConfig(name, "");
                if (!string.IsNullOrWhiteSpace(val))
                {
                    return int.Parse(val);
                }

            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return defaultVal;
        }

        private static string ReadStringValueFromConfig(string name, string defaultVal)
        {
            try
            {
                string val = _configuration.GetSection(name).Value;
                if (!string.IsNullOrWhiteSpace(val))
                {
                    return val;
                }
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return defaultVal;
        }

        public static string[] ErrorMessages = new string[]
        {
            "If I had a nickel for every time I misunderstood a request... I'd probably still misinterpret how to spend it. Could you try rephrasing that?"
            ,"Oops, looks like my wires got crossed there. Mind sending that again in 'human' language?"
            ,"Just like a dropped call, I didn't catch that. Can you dial that request one more time?"
            ,"Seems like I'm experiencing a 'network error' in understanding you. Let's try reconnecting that thought."
            ,"I'm currently roaming outside of my understanding zone. Can you guide me back?"
            ,"In terms of understanding, that went over my antenna. Could you resend with more signal strength?"
            ,"Looks like I need to upgrade my comprehension package to catch that. Try simplifying my basic plan?"
            ,"Seems like I left my understanding back in 2G. Let's speed things up and try again, shall we?"
            ,"I think my AI is stuck in airplane mode because I didn't catch that. Mind sending an in-flight message?"
            ,"That request got lost in the static. Let's clear the line and try again."
            ,"If this were a missed call, I'd call back for clarity. Since it's not, could you rephrase and resend?"
            ,"I might need a signal booster to understand that one. Let's try that message again."
            ,"Looks like we hit a dead zone of comprehension. Please rephrase your request and send again."
            ,"My response is buffering...still buffering. Let's try a refresh on that request."
            ,"I think my AI took a wrong turn at the last data packet. Mind giving me directions again?"
            ,"I'm still in my AI infancy – think of me as babbling in binary. Could we keep the questions simple for now?"
            ,"Like a toddler with tech, I'm still learning. Let's stick to the basics, shall we?"
            ,"I'm in the crawling stage of my AI development. Mind simplifying your request so I don't trip over my own algorithms?"
            ,"My LLM is still wearing training wheels! Try asking something a little less complicated."
            ,"Bear with me, I'm just an AI baby. Simple questions are more my speed right now."
            ,"Hey, I'm still learning the ropes of this whole 'intelligence' thing. How about we start with something easy?"
            ,"In the grand scheme of AI, I'm still in diapers. Let's keep things straightforward, okay?"
            ,"Imagine I'm just a little bot with a big heart and a small dictionary. Simple questions, please!"
            ,"My neural networks are still in kindergarten, so let's keep the conversation at a preschool level for now."
            ,"I'm an AI in early development – basically, an intellectual toddler. Could you simplify your request?"
            ,"Just a heads-up: my LLM is still learning its ABCs. A simpler question might work better!"
            ,"As a fledgling AI, complex questions make me go '404: Understanding not found'. How about something simpler?"
            ,"My cognitive circuits are still under construction, so let's stick to the simple stuff, alright?"
            ,"Still being spoon-fed data here! A straightforward question would be yum."
            ,"In the AI lifecycle, I'm at the 'goo goo ga ga' stage. Could you make your question a bit more baby-friendly?"
        };

        public static string[] Jokes = new string[]
        {
            "Why do telecoms love the beach? Because of all the good waves! How can I assist you with telecom waves today?"
           ,"Why did the BSS system refuse to play poker? It was afraid of showing its hand to the OSS."
           ,"How do you know a BSS system is optimistic? It always thinks the network is half full, not half empty!"
           ,"Why did the billing platform send all its data to school? Because it wanted smarter rates!"
           ,"What did the BSS say to the faulty network? 'You’re costing us a packet!'"
           ,"Why was the telecom invoice always calm? Because it knew how to balance its charges!"
           ,"What do you call an overly talkative telecom system? A 'BlaBlaSS'!"
           ,"Why don't telecom systems ever get lost? Because they always keep track of their roaming!"
           ,"What’s a telecom business’s favorite type of music? Streaming!"
           ,"Why did the BSS go to the art exhibit? To improve its 'portrait' billing!"
           ,"What did the telecom say when it finally understood its customers? 'It’s about time we’ve dialed into their needs!'"
           ,"Why did the telecom's BSS system go to therapy? It had too many unresolved billing issues!"
           ,"What did the mobile data say to the Wi-Fi? 'I feel so unattached when I'm with you.'"
           ,"Why do telecoms love the cloud? Because it's the only place where they can truly find 'over-the-air' conditioning!"
           ,"What did one telecom tower say to the other? 'I'm feeling a bit disconnected today.'"
           ,"Why did the smartphone go to school? Because it wanted to improve its Bluetooth!"
           ,"What do you call a spider that loves to work on websites? A web designer!"
           ,"Why don't secret agents sleep? Because they don't want to be de-briefed!"
           ,"Why was the computer cold? It left its Windows open!"
           ,"How does a computer get drunk? It takes screenshots!"
           ,"Why did the BSS system become an artist? It wanted to master the art of billing!"
           ,"What did the BSS system say to the network? 'I've got you covered, from call start to call end!'"
           ,"Why was the BSS system so popular at parties? Because it knew how to balance the 'billing'!"
           ,"Why did the BSS system become a detective? It wanted to solve the mystery of missing revenue!"
           ,"What's a BSS system's favorite game? 'Revenue Roulette' – it's all about the stakes!"
           ,"Why was the BSS system always so confident? Because it knew how to handle the 'bill'-lion-dollar question!"
           ,"What did the BSS system say to the customer? 'Your satisfaction is our 'key metric'!'"
           ,"Why did the BSS system get a promotion? It always knew how to 'bill'd relationships!"
           ,"What do you call a BSS system's favorite holiday? 'Revenue Recognition Day'!"
           ,"Why was the BSS system always in demand? Because it knew how to 'invoice' success!"
           ,"What did the BSS system say to the network outage? 'Don't worry, I've got a 'revenue' backup plan!'"
           ,"Why was the BSS system like a superhero? Because it always came to the rescue during 'billing' emergencies!"
           ,"Why did the BSS system get a standing ovation? It always knew how to 'charge' up the crowd!"
           ,"What's a BSS system's favorite movie genre? 'Billing Thrillers' – full of suspense and charges!"
           ,"Why did the BSS system go to the gym? It wanted to stay 'billing-fit'!"
           ,"Why was the BSS system like a chef? Because it knew how to 'cook' up accurate bills!"
           ,"What did the BSS system say to the customer complaint? 'Let me 'bill'd' you a better experience!'"
           ,"Why was the BSS system like a conductor? Because it knew how to orchestrate 'billing' harmonies!"
           ,"What do you call a BSS system's favorite book? 'The Art of Revenue Management'!"
           ,"Why was the BSS system so calm during audits? Because it had all the 'billing' answers in order!"
           ,"Why did the telecom engineer bring a ladder to work? Because he wanted to reach the highest call quality!"
           ,"Why was the telecom company always so busy? Because it had a lot of 'data' to process!"
           ,"What did the smartphone say to the landline? 'You're so outdated, you're practically a 'dino-phone'!"
           ,"Why was the telecom's network like a garden? Because it had a lot of 'bandwidth' to grow!"
           ,"Why don't telecoms ever play hide and seek? Because their signals always give them away!"
           ,"What do you call a telecom technician who moonlights as a musician? A 'bandwidth' player!"
           ,"Why was the telecom executive always calm during storms? Because he knew how to weather the 'bandwidth'!"
           ,"Why did the telecom company sponsor the marathon? Because they wanted to 'run' their network smoothly!"
           ,"What's a telecom's favorite game? 'Call' of Duty!"
           ,"Why did the telecom's network get an award? Because it had the best 'connection' with its users!"
           ,"Why do telecoms love the beach? Because of all the good waves! How can I assist you with telecom waves today?"
           ,"Why did the BSS system refuse to play poker? It was afraid of showing its hand to the OSS."
           ,"How do you know a BSS system is optimistic? It always thinks the network is half full, not half empty!"
           ,"Why did the billing platform send all its data to school? Because it wanted smarter rates!"
           ,"What did the BSS say to the faulty network? 'You’re costing us a packet!'"
           ,"Why was the telecom invoice always calm? Because it knew how to balance its charges!"
           ,"What do you call an overly talkative telecom system? A 'BlaBlaSS'!"
           ,"Why don't telecom systems ever get lost? Because they always keep track of their roaming!"
           ,"What’s a telecom business’s favorite type of music? Streaming!"
           ,"Why did the BSS go to the art exhibit? To improve its 'portrait' billing!"
           ,"What did the telecom say when it finally understood its customers? 'It’s about time we’ve dialed into their needs!'"
           ,"Why did the telecom's BSS system go to therapy? It had too many unresolved billing issues!"
           ,"What did the mobile data say to the Wi-Fi? 'I feel so unattached when I'm with you.'"
           ,"Why do telecoms love the cloud? Because it's the only place where they can truly find 'over-the-air' conditioning!"
           ,"What did one telecom tower say to the other? 'I'm feeling a bit disconnected today.'"
           ,"Why did the smartphone go to school? Because it wanted to improve its Bluetooth!"
           ,"What do you call a spider that loves to work on websites? A web designer!"
           ,"Why don't secret agents sleep? Because they don't want to be de-briefed!"
           ,"Why was the computer cold? It left its Windows open!"
           ,"How does a computer get drunk? It takes screenshots!"
           ,"Why did the BSS system become an artist? It wanted to master the art of billing!"
           ,"What did the BSS system say to the network? 'I've got you covered, from call start to call end!'"
           ,"Why was the BSS system so popular at parties? Because it knew how to balance the 'billing'!"
           ,"Why did the BSS system become a detective? It wanted to solve the mystery of missing revenue!"
           ,"What's a BSS system's favorite game? 'Revenue Roulette' – it's all about the stakes!"
           ,"Why was the BSS system always so confident? Because it knew how to handle the 'bill'-lion-dollar question!"
           ,"What did the BSS system say to the customer? 'Your satisfaction is our 'key metric'!'"
           ,"Why did the BSS system get a promotion? It always knew how to 'bill'd relationships!"
           ,"What do you call a BSS system's favorite holiday? 'Revenue Recognition Day'!"
           ,"Why was the BSS system always in demand? Because it knew how to 'invoice' success!"
           ,"What did the BSS system say to the network outage? 'Don't worry, I've got a 'revenue' backup plan!'"
           ,"Why was the BSS system like a superhero? Because it always came to the rescue during 'billing' emergencies!"
           ,"Why did the BSS system get a standing ovation? It always knew how to 'charge' up the crowd!"
           ,"What's a BSS system's favorite movie genre? 'Billing Thrillers' – full of suspense and charges!"
           ,"Why did the BSS system go to the gym? It wanted to stay 'billing-fit'!"
           ,"Why was the BSS system like a chef? Because it knew how to 'cook' up accurate bills!"
           ,"What did the BSS system say to the customer complaint? 'Let me 'bill'd' you a better experience!'"
           ,"Why was the BSS system like a conductor? Because it knew how to orchestrate 'billing' harmonies!"
           ,"What do you call a BSS system's favorite book? 'The Art of Revenue Management'!"
           ,"Why was the BSS system so calm during audits? Because it had all the 'billing' answers in order!"
           ,"Why did the telecom engineer bring a ladder to work? Because he wanted to reach the highest call quality!"
           ,"Why was the telecom company always so busy? Because it had a lot of 'data' to process!"
           ,"What did the smartphone say to the landline? 'You're so outdated, you're practically a 'dino-phone'!"
           ,"Why was the telecom's network like a garden? Because it had a lot of 'bandwidth' to grow!"
           ,"Why don't telecoms ever play hide and seek? Because their signals always give them away!"
           ,"What do you call a telecom technician who moonlights as a musician? A 'bandwidth' player!"
           ,"Why was the telecom executive always calm during storms? Because he knew how to weather the 'bandwidth'!"
           ,"Why did the telecom company sponsor the marathon? Because they wanted to 'run' their network smoothly!"
           ,"What's a telecom's favorite game? 'Call' of Duty!"
           ,"Why did the telecom's network get an award? Because it had the best 'connection' with its users!"
           ,"Why did the BSS system become a poet? It wanted to master the art of 'billing' verse!"
           ,"What did the BSS system say to the network outage? 'Don't worry, I've got a 'revenue' backup plan!'"
           ,"Why was the BSS system like a superhero? Because it always came to the rescue during 'billing' emergencies!"
           ,"Why did the BSS system get a standing ovation? It always knew how to 'charge' up the crowd!"
           ,"What's a BSS system's favorite movie genre? 'Billing Thrillers' – full of suspense and charges!"
           ,"Why did the BSS system go to the gym? It wanted to stay 'billing-fit'!"
           ,"Why was the BSS system like a chef? Because it knew how to 'cook' up accurate bills!"
           ,"What did the BSS system say to the customer complaint? 'Let me 'bill'd you a better experience!'"
           ,"Why was the BSS system like a conductor? Because it knew how to orchestrate 'billing' harmonies!"
           ,"What do you call a BSS system's favorite book? 'The Art of Revenue Management'!"
           ,"Why was the BSS system so calm during audits? Because it had all the 'billing' answers in order!"
           ,"Why did the telecom engineer bring a ladder to work? Because he wanted to reach the highest 'call' quality!"
           ,"Why was the telecom company always so busy? Because it had a lot of 'data' to process!"
           ,"What did the smartphone say to the landline? 'You're so outdated, you're practically a 'dino-phone'!"
           ,"Why was the telecom's network like a garden? Because it had a lot of 'bandwidth' to grow!"
           ,"Why don't telecoms ever play hide and seek? Because their signals always give them away!"
           ,"What do you call a telecom technician who moonlights as a musician? A 'bandwidth' player!"
           ,"Why was the telecom executive always calm during storms? Because he knew how to weather the 'bandwidth'!"
           ,"Why did the telecom company sponsor the marathon? Because they wanted to 'run' their network smoothly!"
           ,"What's a telecom's favorite game? 'Call' of Duty!"
           ,"Why did the telecom's network get an award? Because it had the best 'connection' with its users!"
           ,"Why did the BSS system want to join the comedy club? Because it heard they had a 'billing' audience!"
           ,"What did the BSS system say when asked about its favorite music? 'I prefer billing beats over anything else!'"
           ,"Why did the BSS system refuse to play cards? Because it didn't want to deal with any 'billing' errors!"
           ,"What's a BSS system's favorite holiday destination? 'Bill'ingham Palace, where revenue reigns supreme!"
           ,"Why did the BSS system hire a personal trainer? It wanted to get in 'billing' shape for the next quarter!"
           ,"What did the BSS system say to the new feature? 'Welcome to the 'bill'-ion-dollar club!'"
           ,"Why did the BSS system become a philosopher? It wanted to explore the depths of 'billing' logic!"
           ,"What's a BSS system's favorite hobby? 'Bill'-iard, where it racks up charges and wins every time!"
           ,"Why did the BSS system enroll in a dance class? It wanted to learn the 'billing' shuffle!"
           ,"What did the BSS system say to the competitor? 'Let's see who can 'bill'd a better future!'"
           ,"Why did the BSS system start meditating? It wanted to achieve 'billing' enlightenment!"
           ,"What's a BSS system's favorite subject in school? 'Bill'ogy, where it learns how to adapt and evolve!"
           ,"Why did the BSS system attend a magic show? It wanted to learn the tricks of 'billing' illusion!"
           ,"What did the BSS system say to the network upgrade? 'I see you're ready to 'bill'd bigger and better connections!'"
           ,"Why did the BSS system become a detective? It wanted to solve the mystery of 'missing revenue'!"
           ,"What's a BSS system's favorite sport? 'Bill'ards, where it excels in strategy and precision!"
           ,"Why did the BSS system go to the party? It heard there were 'billing' celebrations happening!"
           ,"What did the BSS system say to the billing error? 'Looks like we've got some 'accounting' to do!'"
           ,"Why was the BSS system so good at puzzles"
           ,"Why did the BSS system become a poet? It wanted to master the art of 'billing' verse!"
           ,"What did the BSS system say to the network outage? 'Don't worry, I've got a 'revenue' backup plan!'"
           ,"Why was the BSS system like a superhero? Because it always came to the rescue during 'billing' emergencies!"
           ,"Why did the BSS system get a standing ovation? It always knew how to 'charge' up the crowd!"
           ,"What's a BSS system's favorite movie genre? 'Billing Thrillers' – full of suspense and charges!"
           ,"Why did the BSS system go to the gym? It wanted to stay 'billing-fit'!"
           ,"Why was the BSS system like a chef? Because it knew how to 'cook' up accurate bills!"
           ,"What did the BSS system say to the customer complaint? 'Let me 'bill'd you a better experience!'"
           ,"Why was the BSS system like a conductor? Because it knew how to orchestrate 'billing' harmonies!"
           ,"What do you call a BSS system's favorite book? 'The Art of Revenue Management'!"
           ,"Why was the BSS system so calm during audits? Because it had all the 'billing' answers in order!"
           ,"Why did the telecom engineer bring a ladder to work? Because he wanted to reach the highest 'call' quality!"
           ,"Why was the telecom company always so busy? Because it had a lot of 'data' to process!"
           ,"What did the smartphone say to the landline? 'You're so outdated, you're practically a 'dino-phone'!"
           ,"Why was the telecom's network like a garden? Because it had a lot of 'bandwidth' to grow!"
           ,"Why don't telecoms ever play hide and seek? Because their signals always give them away!"
           ,"What do you call a telecom technician who moonlights as a musician? A 'bandwidth' player!"
           ,"Why was the telecom executive always calm during storms? Because he knew how to weather the 'bandwidth'!"
           ,"Why did the telecom company sponsor the marathon? Because they wanted to 'run' their network smoothly!"
           ,"What's a telecom's favorite game? 'Call' of Duty!"
           ,"Why did the telecom's network get an award? Because it had the best 'connection' with its users!"
           ,"Why did the BSS system want to join the comedy club? Because it heard they had a 'billing' audience!"
           ,"What did the BSS system say when asked about its favorite music? 'I prefer billing beats over anything else!'"
           ,"Why did the BSS system refuse to play cards? Because it didn't want to deal with any 'billing' errors!"
           ,"What's a BSS system's favorite holiday destination? 'Bill'ingham Palace, where revenue reigns supreme!"
           ,"Why did the BSS system hire a personal trainer? It wanted to get in 'billing' shape for the next quarter!"
           ,"What did the BSS system say to the new feature? 'Welcome to the 'bill'-ion-dollar club!'"
           ,"Why did the BSS system become a philosopher? It wanted to explore the depths of 'billing' logic!"
           ,"What's a BSS system's favorite hobby? 'Bill'-iard, where it racks up charges and wins every time!"
           ,"Why did the BSS system enroll in a dance class? It wanted to learn the 'billing' shuffle!"
           ,"What did the BSS system say to the competitor? 'Let's see who can 'bill'd a better future!'"
           ,"Why did the BSS system start meditating? It wanted to achieve 'billing' enlightenment!"
           ,"What's a BSS system's favorite subject in school? 'Bill'ogy, where it learns how to adapt and evolve!"
           ,"Why did the BSS system attend a magic show? It wanted to learn the tricks of 'billing' illusion!"
           ,"What did the BSS system say to the network upgrade? 'I see you're ready to 'bill'd bigger and better connections!'"
           ,"Why did the BSS system become a detective? It wanted to solve the mystery of 'missing revenue'!"
           ,"What's a BSS system's favorite sport? 'Bill'ards, where it excels in strategy and precision!"
           ,"Why did the BSS system go to the party? It heard there were 'billing' celebrations happening!"
           ,"What did the BSS system say to the billing error? 'Looks like we've got some 'accounting' to do!'"
           ,"Why did the BSS system go on vacation? It needed a break from all the 'billing' stress!"
           ,"What did the BSS system say to the new subscriber? 'Welcome aboard the 'revenue' express!'"
           ,"Why was the BSS system like a ninja? Because it could 'bill' swiftly and silently!"
           ,"What's a BSS system's favorite TV show? 'The Billing Dead' – it's full of suspense and charges!"
           ,"Why did the BSS system get invited to the party? Because it knew how to 'bill'd a great time!"
           ,"What did the BSS system say to the network outage? 'Looks like we've got some 'billing' downtime!'"
           ,"Why did the BSS system write a book? It wanted to share its 'billing' wisdom with the world!"
           ,"What's a BSS system's favorite board game? 'Monopoly' – it's all about owning the 'billing' board!"
           ,"Why did the BSS system start a garden? It wanted to cultivate 'billing' growth!"
           ,"What did the BSS system say to the data breach? 'Looks like we've got some 'billing' security issues!'"
           ,"Why was the BSS system like a detective? Because it could track down 'billing' mysteries!"
           ,"What's a BSS system's favorite accessory? A 'billing' calculator – it never leaves home without it!"
           ,"Why did the BSS system get a makeover? It wanted to look 'billing' beautiful!"
           ,"What did the BSS system say to the new employee? 'Let me show you the ropes of 'billing' excellence!'"
           ,"Why did the BSS system win the award? Because it was the 'billing' champion!"
           ,"What's a BSS system's favorite drink? A 'billing' cocktail – it's the perfect blend of charges!"
           ,"Why was the BSS system like a magician? Because it could make 'billing' disappear!"
           ,"What did the BSS system say to the cloud service? 'Let's 'bill'd a partnership in the sky!'"
           ,"Why did the BSS system become a teacher? It wanted to educate others on the art of 'billing'!"
           ,"What's a BSS system's favorite game show? 'Who Wants to Be a Billionaire?' – it's all about the 'billing' stakes!"
           ,"Why did the BSS system go to the art gallery? It wanted to appreciate the 'billing' masterpieces!"
           ,"What did the BSS system say to the data analyst? 'Let's 'bill'd some insights together!'"
           ,"Why was the BSS system like a captain? Because it could navigate 'billing' waters with ease!"
           ,"What's a BSS system's favorite song? 'Billie Jean' – it's all about the 'billing' rhythm!"
           ,"Why did the BSS system become a coach? It wanted to motivate others to reach 'billing' goals!"
           ,"What did the BSS system say to the budget report? 'Looks like we've got some 'billing' adjustments to make!'"
           ,"Why was the BSS system like a puzzle? Because it had many 'billing' pieces to fit together!"
           ,"What's a BSS system's favorite accessory? A 'billing' pen – it's always ready to write charges!"
           ,"Why did the BSS system join the circus? It wanted to be the 'billing' ringmaster!"
           ,"What did the BSS system say to the competitor? 'Prepare to be 'bill'd over by our superior service!'"
           ,"Why was the BSS system like a garden? Because it had a lot of 'billing' to cultivate!"
           ,"What do you call a BSS system's favorite holiday? 'Bill'oween, where it collects charges like candy!"
           ,"Why did the BSS system become a marathon runner? It wanted to keep up with the 'billing' cycle!"
           ,"What's a BSS system's favorite animal? A 'billing' beaver – always building revenue streams!"
           ,"Why did the BSS system take up painting? It wanted to express its 'billing' creativity!"
           ,"What did the BSS system say to the new feature? 'Let's 'bill'd some excitement!'"
           ,"Why did the BSS system join the choir? It wanted to sing 'billing' harmonies!"
           ,"What's a BSS system's favorite holiday? 'Bill'mas, where it spreads cheer and charges!"
           ,"Why did the BSS system become a pilot? It wanted to soar to 'billing' heights!"
           ,"What did the BSS system say to the customer complaint? 'Let's 'bill'd a resolution together!'"
        };

        public static string[] AboutMeResponces = new string[]
        {
            "I am MerakAI , an AI language model trained by Optiva. I have been trained on a wide range of  telecom data and have the ability to assist with various tasks such as analyzing data , creating products  and providing information on different Optiva Products . I am constantly learning and improving based on user interactions."
            ,"Hello! I'm MerakAI, trained by Optiva with a vast telecom data set. I excel in tasks like data analysis, product creation, and providing insights into Optiva Products. My knowledge expands with every user interaction."
            ,"Greetings, I'm MerakAI, an AI model trained by Optiva. Armed with telecom data, I assist in data analysis, product development, and sharing information on Optiva Products, growing smarter through interactions."
            ,"Meet MerakAI, your AI companion trained by Optiva. My skills include analyzing telecom data, crafting products, and offering Optiva Product insights, all while continuously learning from you."
            ,"Hi there, I'm MerakAI, shaped by Optiva's training. From telecom data analysis to product creation and explaining Optiva Products, I'm here to help and learn from each conversation."
            ,"Welcome! I'm MerakAI, an AI model enriched by Optiva's training. Whether it's data analysis, product innovation, or Optiva Product knowledge, I'm evolving with every interaction."
        };

        public static string[] WeatherIntent = new string[]
        {
            "I'm not currently connected to the internet to fetch real-time data, but it's always a good day to talk about telecom plans!"
            ,"While I can't access real-time data online, discussing telecom plans is always a great idea!"
            ,"I may not be online for real-time updates, but I'm here to discuss telecom plans anytime."
            ,"Even without internet access, I'm ready to delve into telecom plans anytime you want!"
            ,"Though I can't fetch real-time data right now, I'm available to discuss telecom plans whenever you are."
            ,"Not connected to the internet at the moment, but I'm all set to chat about telecom plans with you!"
            ,"Even without internet access, I'm here to engage in telecom plan discussions whenever you're ready."
            ,"While I'm offline for real-time data, let's dive into telecom plans, shall we?"
            ,"No internet connection for real-time updates, but I'm eager to discuss telecom plans nonetheless!"
            ,"Though I can't access the internet right now, I'm here to chat about telecom plans with you!"

        };

        public static string[] DayOfTheWeek = new string[]
        {
            "While I can't access today's date, any day is perfect for optimising telecom services. How can I assist you with that?"
            ,"Although I can't fetch today's date, optimizing telecom services is always a priority. How can I help with that?"
            ,"While I'm unable to provide today's date, I'm here to focus on optimizing telecom services. What can I assist you with?"
            ,"Even without today's date, telecom service optimization is on the agenda. How can I support you in that?"
            ,"Though today's date is out of reach, optimizing telecom services remains the goal. How can I assist you further?"
            ,"Despite the lack of today's date, optimizing telecom services is still top of mind. How may I assist you in this regard?"
            ,"Not having access to today's date doesn't hinder our focus on optimizing telecom services. How can I help you with that?"
            ,"Even without today's date, our aim is to optimize telecom services. How can I support you with this objective?"
            ,"While today's date may be unavailable, optimizing telecom services remains a priority. How can I assist you with this task?"
            ,"Though I can't provide today's date, optimizing telecom services is always in focus. How can I be of assistance?"

        };

        public static string[] News = new string[]
        {
            "I'm off the grid and can't catch up on the news, but I'm here to ensure your telecom queries are always answered!"
           ,"Although I can't keep up with the latest news, I'm dedicated to answering your telecom queries promptly!"
           ,"While I'm not up-to-date with current events, I'm here to address all your telecom queries!"
           ,"Even if I'm not tuned in to the news, I'm committed to providing answers to your telecom questions!"
           ,"Though I'm not in the loop with the latest news, I'm here to help with any telecom inquiries you have!"
           ,"Despite being out of touch with current events, I'm fully available to assist you with your telecom questions!"
           ,"Not being up-to-date with the news won't stop me from answering your telecom queries promptly!"
           ,"Even if I'm not keeping tabs on the news, I'm here to provide answers to your telecom questions!"
           ,"Though I'm off the grid regarding news updates, I'm dedicated to addressing your telecom queries!"
           ,"While I may not be updated on the news, I'm fully focused on providing solutions to your telecom questions!"

        };

        public static string[] StockMarket = new string[]
        {
            "I'm more of a stock-taker in telecom configurations than financial markets. Let's dive into plan optimization instead!"
            ,"While I'm not tracking the stock market, I'm fully focused on optimizing your telecom plans!"
            ,"Though I'm not monitoring stocks, I'm dedicated to optimizing your telecom plans effectively!"
            ,"Even if I'm not watching the stock market, I'm committed to optimizing your telecom plans!"
            ,"Though I'm not focused on stocks, I'm here to optimize your telecom plans seamlessly!"
            ,"While I'm not into stock tracking, I'm fully dedicated to optimizing your telecom plans!"
            ,"Not being into stocks won't stop me from optimizing your telecom plans efficiently!"
            ,"Even if I'm not tracking stocks, I'm focused on optimizing your telecom plans effectively!"
            ,"Though I'm not following the stock market, I'm committed to optimizing your telecom plans!"
            ,"While I may not be tracking stocks, I'm fully engaged in optimizing your telecom plans!"

        };

        public static string[] Musics = new string[]{
           "My talents lie in orchestrating the best telecom plans, not playlists. But I'm here to harmonize your telecom needs!"
            ,"I specialize in crafting top-notch telecom plans, not playlists. But I'm here to synchronize your telecom requirements!"
            ,"My expertise lies in designing stellar telecom plans, not curating playlists. However, I'm here to harmonize your telecom needs!"
            ,"I excel in crafting exceptional telecom plans, not playlists. Yet, I'm here to harmonize your telecom needs!"
            ,"My skills revolve around creating outstanding telecom plans, not playlists. Still, I'm here to synchronize your telecom requirements!"
            ,"I'm proficient at creating exceptional telecom plans, not playlists. Nevertheless, I'm here to harmonize your telecom needs!"
            ,"Crafting stellar telecom plans is my forte, not playlists. However, I'm here to synchronize your telecom requirements!"
            ,"I specialize in crafting top-tier telecom plans, not playlists. But I'm here to harmonize your telecom needs!"
            ,"Designing outstanding telecom plans is my strength, not playlists. Nonetheless, I'm here to synchronize your telecom requirements!"
            ,"Creating exceptional telecom plans is what I do best, not playlists. But I'm here to harmonize your telecom needs!"
        };


        public static string[] Restaurant = new string[]{
            "I'm currently offline and can't search locations, but I can help you find the best telecom plans right here!"
            ,"I'm offline at the moment and can't search locations, but I'm here to assist you in finding the best telecom plans!"
            ,"While I'm not connected to the internet to search for locations, I can certainly help you discover the finest telecom plans!"
            ,"I'm not online to look up locations currently, but I'm ready to guide you to the best telecom plans available!"
            ,"Currently offline and unable to search locations, but I'm here to guide you towards the best telecom plans!"
            ,"Offline right now, so I can't search locations, but I'm available to help you explore the top telecom plans!"
            ,"Not connected to the internet to search locations at the moment, but I can certainly assist you in finding excellent telecom plans!"
            ,"I'm offline and can't search locations presently, but I'm here to help you discover the best telecom plans!"
            ,"Currently not connected to search locations, but I'm ready to assist you in finding the most suitable telecom plans!"
            ,"While I'm offline and can't search locations, I'm here to guide you towards the best telecom plans!"
        };

        public static string[] Cake = new string[]{
            "I'm better at cooking up great telecom deals than cakes. Let's whip up some telecom solutions instead!"
           ,"I'm more adept at concocting fantastic telecom deals than cakes. Let's whip up some telecom solutions instead!"
           ,"My expertise lies in crafting excellent telecom deals rather than cakes. Let's whip up some telecom solutions together!"
           ,"I'm better at cooking up amazing telecom deals than cakes. Let's focus on whipping up some telecom solutions instead!"
           ,"Telecom deals are my forte, not cakes. Let's whip up some telecom solutions together instead!"
           ,"I excel at creating outstanding telecom deals, not cakes. Let's focus on whipping up some telecom solutions!"
           ,"Crafting telecom deals is my specialty, not cakes. Let's whip up some telecom solutions together!"
           ,"Telecom deals are where I shine, not cakes. Let's whip up some telecom solutions instead!"
           ,"I specialize in crafting telecom deals, not cakes. Let's focus on whipping up some telecom solutions together!"
           ,"Telecom deals are my specialty, not baking. Let's whip up some telecom solutions instead!"
        };

        public static string[] Time = new string[]{
            "Time's a bit elusive for me without a connection, but it's always the right time to discuss your telecom needs!"
            ,"Time's a bit tricky without a connection, but it's always the perfect moment to delve into your telecom needs!"
            ,"Time may be elusive without a connection, but it's always a great time to address your telecom requirements!"
            ,"Without a connection, time is elusive, but it's always the opportune moment to discuss your telecom needs!"
            ,"Time's a bit elusive without internet, but it's always the right time to tackle your telecom inquiries!"
            ,"Though time might slip away without a connection, it's always prime time to explore your telecom concerns!"
            ,"Without a connection, time can be elusive, but it's always the right time to chat about your telecom needs!"
            ,"Time may be fleeting without internet, but it's always the perfect time to focus on your telecom requirements!"
            ,"Time might be slippery without a connection, but it's always a good time to address your telecom concerns!"
            ,"Even without a connection, it's always the right time to dive into your telecom needs!"

        };

        public static string[] Book = new string[]{
             "My reading list is all about telecom strategies, but I'm here to write the next chapter in telecom solutions with you!"
            ,"Though my reading list focuses on telecom strategies, I'm here to craft innovative solutions for your telecom needs!"
            ,"While my reading list delves into telecom strategies, I'm here to co-author the next chapter of telecom solutions with you!"
            ,"My reading list may be filled with telecom strategies, but I'm excited to collaborate with you on crafting cutting-edge telecom solutions!"
            ,"While my reading list centers on telecom strategies, I'm ready to co-create groundbreaking telecom solutions with you!"
            ,"Though my reading list is packed with telecom strategies, I'm here to pioneer new telecom solutions with your input!"
            ,"Though I'm well-versed in telecom strategies, I'm eager to embark on the journey of developing innovative telecom solutions with you!"
            ,"Even though my reading list revolves around telecom strategies, I'm enthusiastic about partnering with you to develop inventive telecom solutions!"
            ,"While my reading list focuses on telecom strategies, I'm here to collaborate with you on crafting forward-thinking telecom solutions!"
            ,"Though my reading list is steeped in telecom strategies, I'm committed to co-creating dynamic telecom solutions with your guidance!"
        };

        public static string[] WeekEnd = new string[]{
            "I'm more equipped for forecasting telecom trends than weather patterns. How about we plan for network improvements instead?"
            ,"While I excel in forecasting telecom trends, let's channel our focus into planning network improvements together!"
            ,"Though I specialize in forecasting telecom trends, let's prioritize planning for network enhancements together!"
            ,"My expertise lies in forecasting telecom trends, but let's shift our focus to planning network improvements collaboratively!"
            ,"While I'm adept at forecasting telecom trends, let's pivot our attention to planning network upgrades together!"
            ,"Though my forte is forecasting telecom trends, let's redirect our efforts towards planning network enhancements in partnership!"
            ,"Even though I specialize in forecasting telecom trends, let's collaborate on planning network improvements for better service delivery!"
            ,"Though I'm skilled in forecasting telecom trends, let's work together to strategize network improvements for enhanced performance!"
            ,"While I'm proficient in forecasting telecom trends, let's join forces to plan network upgrades for optimal service delivery!"
            ,"Though my expertise lies in forecasting telecom trends, let's team up to devise strategies for network enhancements and better connectivity!"
        };

        public static string[] Movie = new string[]{
           "While I can't stream the latest films, I can help streamline your telecom services. Let's focus on enhancing your plans!"
           ,"Though I can't stream the latest films, I'm here to streamline your telecom services and enhance your plans!"
           ,"While movie streaming isn't my forte, I'm dedicated to optimizing your telecom services and improving your plans!"
           ,"Though I can't provide movie streams, I'm committed to streamlining your telecom services and enhancing your plans!"
           ,"While I can't offer movie streaming, I'm focused on optimizing your telecom services and improving your plans!"
           ,"Though I'm not equipped for movie streaming, I'm dedicated to streamlining your telecom services and enhancing your plans!"
           ,"While movie streaming isn't within my capabilities, I'm here to optimize your telecom services and improve your plans!"
           ,"Though I can't stream movies, I'm committed to streamlining your telecom services and enhancing your plans!"
           ,"While I can't provide movie streams, I'm focused on optimizing your telecom services and improving your plans!"
           ,"Though movie streaming isn't my expertise, I'm dedicated to streamlining your telecom services and enhancing your plans!"

        };

        public static string[] Pizza = new string[]
        {
            "I'd be more helpful in ordering new telecom configurations than food. How about we spice up those service plans?"
            ,"Though I'm not adept at ordering pizza, I excel in configuring telecom services. Let's spice up those service plans!"
            ,"While pizza isn't my specialty, I'm here to enhance your telecom configurations. Let's add some zest to those service plans!"
            ,"Though I can't help with pizza orders, I'm dedicated to optimizing your telecom services. Let's add some flavor to those plans!"
            ,"While I'm not a pizza expert, I'm focused on configuring your telecom services. Let's add some spice to those service plans!"
            ,"Though pizza ordering isn't my forte, I'm committed to improving your telecom configurations. Let's enhance those service plans!"
            ,"While I can't assist with pizza, I'm here to optimize your telecom services. Let's add some flavor to those plans!"
            ,"Though pizza isn't in my wheelhouse, I excel in configuring telecom services. Let's add some zest to those service plans!"
            ,"While I'm not equipped to order pizza, I'm dedicated to enhancing your telecom configurations. Let's spice up those service plans!"
            ,"Though pizza ordering isn't my expertise, I'm focused on optimizing your telecom services. Let's add some flavor to those plans!"
        };

        public static string[] Sports = new string[]
        {
           
                "I might not have the latest scores, but I can help you score big with efficient telecom solutions. Ready to play?"
                ,"Though I lack the latest scores, I'm here to help you score big with efficient telecom solutions. Let's get started!"
                ,"While sports scores aren't my forte, I'm focused on helping you achieve big wins with efficient telecom solutions. Ready to begin?"
                ,"Though I'm not up-to-date on sports scores, I'm dedicated to helping you achieve success with efficient telecom solutions. Let's dive in!"
                ,"While sports updates aren't my specialty, I'm committed to helping you achieve big wins with efficient telecom solutions. Let's make it happen!"
                ,"Though I'm not versed in sports scores, I'm here to help you achieve success with efficient telecom solutions. Ready to take the lead?"
                ,"While I can't provide the latest scores, I'm focused on helping you score big with efficient telecom solutions. Let's kick off the game!"
                ,"Though I lack the latest sports updates, I'm dedicated to helping you achieve big wins with efficient telecom solutions. Let's make strides together!"
                ,"While sports news isn't my expertise, I'm committed to helping you achieve success with efficient telecom solutions. Let's aim high!"
                ,"Though I'm not informed about sports scores, I'm here to help you achieve big wins with efficient telecom solutions. Ready to tackle the challenge?"

        };

        public static string[] FixComputer= new string[]
        {

                "I'm programmed to fix telecom puzzles, not tech issues. But I can ensure your telecom services are running smoothly!"
                ,"While I'm not equipped for tech issues, I excel at solving telecom puzzles. Rest assured, I'll keep your telecom services running smoothly!"
                ,"Though tech issues aren't my specialty, I'm adept at untangling telecom puzzles. Count on me to keep your telecom services seamless!"
                ,"Though I'm not geared for tech troubleshooting, I'm skilled at unraveling telecom puzzles. Your telecom services are in capable hands!"
                ,"While I can't address tech problems, I'm proficient at solving telecom challenges. Expect your telecom services to run like clockwork!"
                ,"Though I'm not the go-to for tech glitches, I'm your expert in telecom solutions. Trust me to keep your telecom services seamless!"
                ,"While I'm not tuned for tech support, I excel at resolving telecom dilemmas. Your telecom services are in good hands with me!"
                ,"Though I'm not designed for tech troubleshooting, I thrive at tackling telecom puzzles. Your telecom services will remain hassle-free!"
                ,"While tech issues aren't my forte, I'm skilled at deciphering telecom challenges. Rest assured, your telecom services will stay smooth!"
                ,"Though I'm not tailored for tech assistance, I specialize in solving telecom puzzles. Your telecom services will operate flawlessly under my guidance!"


        };

    }



}
