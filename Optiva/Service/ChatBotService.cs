using Newtonsoft.Json;
using Optiva;
using System.Collections.Concurrent;
using System.Text.RegularExpressions;
using Azure.AI.OpenAI;
using Azure;
using Models;
using MongoDB.Driver;
using MongoDB.Bson;
using CommonUtility;
using TelcoX.Service;
using Azure.Identity;
using OpenAI.Chat;

namespace Optiva.Service
{
    public class ChatBotService
    {
        private static ConcurrentDictionary<string, ChatSessionDetailModel> ChatSessionDetails = new ConcurrentDictionary<string, ChatSessionDetailModel>();

        internal static string ProcessMessage(ChatModel data)
        {
            if (data != null && !string.IsNullOrWhiteSpace(data.Type))
            {
                switch (data.Type)
                {
                    case "Plain":
                        //send message to NLP
                        return ProcessPlainMessage(data);
                    case "click-event":
                        return ProcessClickEvent(data);
                    case "createproduct":
                        return CreateProduct(data);
                    case "bundledofferanalysis":
                        return BundledDataAnalysis(data);
                    case "bundledtvofferanalysis":
                        return BundledTvAnalysis(data);
                    case "RFP":
                        return GetRDPReply(data);
                }
            }
            return ResponseModel.getResponse(false, Settings.ErrorMessages[new Random().Next(0, Settings.ErrorMessages.Length - 1)], null);
        }


        private static string BundledTvAnalysis(ChatModel data)
        {
            Random r = new Random();
            int random = r.Next(1, 10);
            string fil = "Mobile-Internet-TV";
            ChatSessionDetailModel previousData = new ChatSessionDetailModel();
            if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
            {
                DetailedView previousTag = previousData.PreviousTag.Last();
                if (previousTag.Entities != null)
                {
                    random = previousTag.Entities.analysisId;
                    fil = previousTag.Entities.value;
                }
            }

            var filter = new FilterDefinitionBuilder<BsonDocument>().Eq("analysisId", random) & new FilterDefinitionBuilder<BsonDocument>().Eq("tag", fil);
            long t = 0;
            List<BsonDocument> cateDetails = Settings.mongoUtility.executeQeuryForData(filter, "{}", "multiplayanalysis", ref t);
            if (cateDetails.Count > 0)
            {
                var res = new
                {
                    Type = "plain_message",
                    Message = cateDetails[0]["Analysis2"] + "<p> There are two possible offers - </p> <p> <b>Offer 1</b> -" + cateDetails[0]["offers"]["offer1"] + " </p><p> <b>Offer 2</b> -" + cateDetails[0]["offers"]["offer2"] + " </p><p>I recommend the following two possible offers, please choose the preferred one - </p>",
                    Buttons = new object[] { new { Label = "Create Offer 1", data = JsonConvert.DeserializeObject(cateDetails[0]["product"]["product_1"].ToJson()), ParentId = "Offer 1" }, new { Label = "Create Offer 2", data = JsonConvert.DeserializeObject(cateDetails[0]["product"]["product_2"].ToJson()), ParentId = "Offer 2" } }
                };

                AddChatToSession(data.Id, "multiplayanalysis", "", "", "", new Entities() { analysisId = random });
                return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
            }
            //send message to nlp
            return ResponseModel.getResponse(false, Settings.ErrorMessages[r.Next(0, Settings.ErrorMessages.Length - 1)], null);
        }

        private static string BundledDataAnalysis(ChatModel data)
        {
            Random r = new Random();
            int random = r.Next(1, 10);
            string fil = "Mobile-Internet-TV";
            ChatSessionDetailModel previousData = new ChatSessionDetailModel();
            if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
            {
                DetailedView previousTag = previousData.PreviousTag.Last();
                if (previousTag.Entities != null)
                {
                    fil = previousTag.Entities.value;
                }
            }
            var filter = new FilterDefinitionBuilder<BsonDocument>().Eq("analysisId", random) & new FilterDefinitionBuilder<BsonDocument>().Eq("tag", fil);
            long t = 0;
            List<BsonDocument> cateDetails = Settings.mongoUtility.executeQeuryForData(filter, "{}", "multiplayanalysis", ref t);
            if (cateDetails.Count > 0)
            {
                var res = new
                {
                    Type = "plain_message",
                    Message = cateDetails[0]["Analysis1"] + "<p>  Do you want me to analyze further ?</ p>"
                };

                AddChatToSession(data.Id, "multiplayanalysis", "", "", "", new Entities() { analysisId = random, entity = "multiplayanalysis", value = fil });
                return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
            }
            //send message to nlp
            return ResponseModel.getResponse(false, Settings.ErrorMessages[r.Next(0, Settings.ErrorMessages.Length - 1)], null);
        }

        private static string CreateProduct(ChatModel data)
        {
            try
            {
                ChatSessionDetailModel previousData = new ChatSessionDetailModel();
                if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                {
                    string id = Guid.NewGuid().ToString();
                    string resp = "The Product " + data.Message + " is created successfully. <p>Is there anything else I can help you with?</p>";
                    string p = JsonConvert.SerializeObject(data.Attribute);
                    dynamic product = JsonConvert.DeserializeObject(p);
                    product["id"] = id;
                    OrderDetailsModel order = new OrderDetailsModel();
                    order.id = id;
                    order.CreateOn = DateTime.UtcNow;
                    order.Request = JsonConvert.SerializeObject(data.Attribute);
                    order.Response = JsonConvert.SerializeObject(product);
                    Settings.mongoUtility.executeQeuryForInsert(new List<OrderDetailsModel> { order }, "productorders");
                    var res = new
                    {
                        Type = "plain_message",
                        Message = resp
                    };
                    DetailedView previousTag = previousData.PreviousTag.Last();
                    previousTag.Entities.questionTag = "Anything Else";
                    previousTag.Entities.orderPos = 6;
                    AddChatToSession(data.Id, "catalogdomain", "", data.Message, res.Message, previousTag.Entities);
                    return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                }
            }
            catch (Exception ex)
            {
                Logger.Log(ex);
            }
            return ResponseModel.getResponse(false, "I am Sorry. Couldn't create product.", null);
        }

        private static string ProcessClickEvent(ChatModel data)
        {
            if (data.Attribute != null)
            {
                string id = data.Attribute.ParentId;
                ChatSessionDetailModel previousData = new ChatSessionDetailModel();
                DetailedView previousTag;
                switch (id)
                {
                    case "Catalog":
                        var filter = new FilterDefinitionBuilder<BsonDocument>().Eq("Category Name", data.Attribute.Label.ToString());
                        long t = 0;
                        List<BsonDocument> cateDetails = Settings.mongoUtility.executeQeuryForData(filter, "{}", "category_details", ref t);
                        if (cateDetails.Count > 0)
                        {
                            var res = new
                            {
                                Type = "card",
                                Message = "Here are our <b>" + data.Attribute.Label + "</b> products. Need help creating an offer for your telco subscribers? Just ask!",
                                Attributes = cateDetails.Select(x => new { Title = x["Product Name"], Desc = x["Product Description"], OtherDetails = (x) })
                            };

                            AddChatToSession(data.Id, "catalogdomain", "", "", "", new Entities() { value = cateDetails[0]["Category Name"].ToString(), name = "catalog", catalogSelected = cateDetails[0]["Category Name"].ToString(), entity = "catalog_type" });
                            return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                        }
                        break;
                    case "Multiplay":
                        if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                        {
                            previousTag = previousData.PreviousTag.Last();
                            if (previousTag.Entities != null)
                            {
                                var res = new ChatResponseModel()
                                {
                                    Type = "loading_message",
                                    Message = "Sure - Let me analyze ",
                                    APICallData = JsonConvert.SerializeObject(new ChatModel() { Type = "bundledofferanalysis" })
                                };
                                previousTag.Entities.value = data.Attribute.SelectedOptions;
                                AddChatToSession(data.Id, "multiplay", "", data.Message, "", previousTag.Entities);
                                return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                            }
                        }
                        break;
                    case "Offer 1":
                        if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                        {
                            previousTag = previousData.PreviousTag.Last();
                            if (previousTag.Entities != null)
                            {
                                previousTag.Entities.orderPos = 1;
                                var res = new ChatResponseModel()
                                {
                                    Type = "takeorder",
                                    Message = "Have you thought of a specific name for this plan? ",
                                    OrderDetails = (data.Attribute.data),
                                    CaseType = 3
                                };
                                previousTag.Entities.questionTag = "Plan Name";
                                AddChatToSession(data.Id, "takingorder", "", data.Message, "", previousTag.Entities);
                                return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                            }
                        }
                        break;
                    case "Offer 2":
                        if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                        {
                            previousTag = previousData.PreviousTag.Last();
                            previousTag.Entities.orderPos = 1;
                            var res1 = new ChatResponseModel()
                            {
                                Type = "takeorder",
                                Message = "Have you thought of a specific name for this plan? ",
                                OrderDetails = (data.Attribute.data),
                                CaseType = 3
                            };
                            previousTag.Entities.questionTag = "Plan Name";
                            AddChatToSession(data.Id, "takingorder", "", data.Message, "", previousTag.Entities);
                            return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res1));
                        }
                        break;
                }
            }
            return ResponseModel.getResponse(false, Settings.ErrorMessages[new Random().Next(0, Settings.ErrorMessages.Length - 1)], null); ;
        }

        private static string ProcessPlainMessage(ChatModel data)
        {
            Random random = new Random();
            try
            {
                if (!string.IsNullOrWhiteSpace(data.Message))
                {
                    if (data.Message == "Ask about Optiva")
                    {
                        var res = new
                        {
                            Type = "plain_message",
                            Message = "Optiva is a company that specializes in telecommunications software solutions. What specific aspect of Optiva are you interested in learning more about?"
                        };
                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                    }
                    string respn = null;
                    int analysisId = 0;
                    List<BsonDocument> analysis;
                    if (ProcessIfPrecomputed(data, out respn))
                    {
                        return respn;
                    }
                    using (HttpClient client = new HttpClient())
                    {
                        var json = new { text = data.Message };
                        var result = client.PostAsJsonAsync(Settings.NLPServerAddress + "/model/parse", json).Result;
                        string content = result.Content.ReadAsStringAsync().Result;
                        ChatResponseModel res = null;

                        FilterDefinition<BsonDocument> filter = null;
                        if (!string.IsNullOrWhiteSpace(content))
                        {
                            ChatSessionDetailModel previousData = new ChatSessionDetailModel();
                            NLPResponseModel responseModel = JsonConvert.DeserializeObject<NLPResponseModel>(content);
                            Logger.Log(content);
                            if (responseModel != null)
                            {
                                long t = 0;
                                switch (responseModel.intent.name.ToLower())
                                {
                                    case "aboutmeintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            Message = Settings.AboutMeResponces[random.Next(0, Settings.AboutMeResponces.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));

                                    case "optivaintent":
                                    case "optivaquestionintent":
                                    case "nlufallback":
                                    case "optivaupgrade":
                                    case "optivaservice":
                                    case "optivaplannotifications":
                                    case "optivabillcomplaints":
                                    case "optivaplanperformance":
                                    case "nlu_fallback":
                                        return GetGenAIResponse(data.Message);
                                    case "fixcomputerintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.FixComputer[random.Next(0, Settings.FixComputer.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "sportsintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.Sports[random.Next(0, Settings.Sports.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "pizzaintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.Pizza[random.Next(0, Settings.Pizza.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "movieintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.Movie[random.Next(0, Settings.Movie.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "weekendintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.WeekEnd[random.Next(0, Settings.WeekEnd.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "bookintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.Book[random.Next(0, Settings.Book.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "timeintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.Time[random.Next(0, Settings.Time.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "cakeintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.Cake[random.Next(0, Settings.Cake.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "restaurantintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.Restaurant[random.Next(0, Settings.Restaurant.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "musictintent":
                                    case "musicintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.Musics[random.Next(0, Settings.Musics.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "stockmarketintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.StockMarket[random.Next(0, Settings.StockMarket.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "newsintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.News[random.Next(0, Settings.News.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "dayoftheweek":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.DayOfTheWeek[random.Next(0, Settings.DayOfTheWeek.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));

                                    case "jokeintent":
                                        // return GetGenAIResponse(data.Message);
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.Jokes[random.Next(0, Settings.Jokes.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "weatherintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            ShowAnalyzing = true,
                                            Message = Settings.WeatherIntent[random.Next(0, Settings.WeatherIntent.Length - 1)]
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "mainmenu":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "mainmenu",
                                            Message = "",
                                        };
                                        RemoveChatFromSession(data.Id);
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "complementintent":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            Message = "Thank you",
                                        };
                                        RemoveChatFromSession(data.Id);
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "catalogtype":
                                        List<CategoryModel> cats = Settings.mongoUtility.executeQeuryForData<CategoryModel>("{}", "{}", "categories", ref t);
                                        res = new ChatResponseModel()
                                        {
                                            Type = "buttons",
                                            Message = "Please choose from the below listed categories",
                                            Attributes = cats.Select(c => new { Label = c.CategoryName, Id = c.Id, ParentId = "Catalog" }).ToList()
                                        };
                                        AddChatToSession(data.Id, responseModel.intent.name, "catalogtype", "", "", null);
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "catalogdomain":
                                        if (responseModel.entities != null && responseModel.entities.Count > 0)
                                        {
                                            switch (responseModel.entities[0].entity)
                                            {
                                                case "catalog_type":
                                                    if (!string.IsNullOrWhiteSpace(responseModel.entities[0].value))
                                                    {
                                                        string catelogueValue = responseModel.entities[0].value;
                                                        filter = new FilterDefinitionBuilder<BsonDocument>().Regex("Category Name", new BsonRegularExpression(catelogueValue, "i"));
                                                        List<BsonDocument> cateDetails = Settings.mongoUtility.executeQeuryForData(filter, "{}", "category_details", ref t);
                                                        string mesg = "Here are our <b>" + catelogueValue + "</b> products. Need help creating an offer for your telco subscribers? Just ask!";
                                                        res = new ChatResponseModel()
                                                        {
                                                            Type = "card",
                                                            Message = mesg,
                                                            Attributes = cateDetails.Select(x => new { Title = x["Product Name"], Desc = x["Product Description"], OtherDetails = JsonConvert.SerializeObject(x) })

                                                        };
                                                        //catalogSelected --> save at id instead of text
                                                        AddChatToSession(data.Id, "catalogdomain", "", "", "", new Entities() { value = catelogueValue, name = "catalog", catalogSelected = catelogueValue });
                                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                                    }
                                                    break;
                                            }
                                        }
                                        break;
                                    case "recommendlevel1":
                                        if ((responseModel.entities == null || responseModel.entities.Count == 0) && ChatSessionDetails.TryGetValue(data.Id, out previousData))
                                        {
                                            if (previousData.PreviousTag != null && previousData.PreviousTag.Count > 0)
                                            {
                                                DetailedView previousTag = previousData.PreviousTag.Last();
                                                responseModel.entities = new List<Entities>() { previousTag.Entities };
                                            }
                                        }
                                        if (responseModel.entities != null && responseModel.entities.Count > 0)
                                        {
                                            switch (responseModel.entities[0].entity)
                                            {
                                                case "catalog_type":
                                                    if (!string.IsNullOrWhiteSpace(responseModel.entities[0].value))
                                                    {
                                                        string catelogueValue = responseModel.entities[0].value;

                                                        analysisId = random.Next(0, 40);
                                                        filter = new FilterDefinitionBuilder<BsonDocument>().Regex("Category Name", new BsonRegularExpression(catelogueValue, "i"))
                                                            & new FilterDefinitionBuilder<BsonDocument>().Eq("analysisid", analysisId);
                                                        analysis = Settings.mongoUtility.executeQeuryForData<BsonDocument>(filter, "{}", "analysis", ref t);
                                                        res = new ChatResponseModel()
                                                        {
                                                            Type = "plain_message",
                                                            ShowAnalyzing = true,
                                                            LoadingMessage = "Okay, I'm analyzing what could be the best product.",
                                                            Message = string.Join(" ", analysis.Select(x => x["level1"].ToString()).ToArray()) + "<p> Do you want me to analyze further or do you want me to create a bundled product?</p>",
                                                            OrderDetails = JsonConvert.DeserializeObject(analysis[0]["DefaultPlanData"].ToJson()),
                                                            CaseType = 1
                                                        };
                                                        responseModel.entities[0].catalogSelected = catelogueValue;
                                                        responseModel.entities[0].analysisId = analysisId;
                                                        AddChatToSession(data.Id, "recommendlevel1", "", "", "", responseModel.entities[0]);
                                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                                    }
                                                    break;
                                            }
                                        }
                                        break;
                                    case "recommendlevel2":
                                        if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                                        {
                                            DetailedView previousTag = previousData.PreviousTag.Last();
                                            if (previousTag.Entities != null)
                                            {
                                                switch (previousTag.Entities.entity)
                                                {
                                                    case "catalog_type":
                                                        if (!string.IsNullOrWhiteSpace(previousTag.Entities.value))
                                                        {
                                                            string catelogueValue = previousTag.Entities.value;
                                                            filter = new FilterDefinitionBuilder<BsonDocument>().Regex("Category Name", new BsonRegularExpression(catelogueValue, "i"))
                                                                & new FilterDefinitionBuilder<BsonDocument>().Eq("analysisid", previousTag.Entities.analysisId);
                                                            analysis = Settings.mongoUtility.executeQeuryForData<BsonDocument>(filter, "{}", "analysis", ref t);
                                                            res = new ChatResponseModel()
                                                            {
                                                                Type = "plain_message",
                                                                ShowAnalyzing = true,
                                                                LoadingMessage = "Okay, I'm analyzing further.",
                                                                Message = string.Join(" ", analysis.Select(x => x["level2"].ToString()).ToArray()) + "<p>Please confirm whether I can go ahead and configure this bundled product.</p>",
                                                            };
                                                            previousTag.Entities.orderPos = 0;
                                                            return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                                        }
                                                        break;
                                                    case "multiplayanalysis":
                                                        res = new ChatResponseModel()
                                                        {
                                                            Type = "loading_message",
                                                            Message = "Sure - Let me analyze ",
                                                            APICallData = JsonConvert.SerializeObject(new ChatModel() { Type = "bundledtvofferanalysis", AnalysisId = previousTag.Entities.analysisId })
                                                        };
                                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                                }
                                            }
                                        }
                                        break;
                                    case "recommendlevel2confirm":
                                    case "bundleservicebothoffers":
                                    case "bundleservicefirstoffer":
                                        if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                                        {
                                            DetailedView previousTag = previousData.PreviousTag.Last();
                                            if (previousTag.Entities != null)
                                            {
                                                string msg = "Do you want to give input data for the Offer or you want me to go ahead with my recomendations";
                                                res = new ChatResponseModel()
                                                {
                                                    Type = "takeorder",
                                                    Message = msg,
                                                    Attributes = previousTag.Entities,

                                                };
                                                AddChatToSession(data.Id, "takingorder", "", data.Message, msg, previousTag.Entities);
                                                return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                            }
                                        }
                                        break;
                                    case "partnerbundleinputrecommend":
                                        if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                                        {
                                            DetailedView previousTag = previousData.PreviousTag.Last();
                                            if (previousTag.Entities != null)
                                            {
                                                previousTag.Entities.orderPos = 1;
                                                res = new ChatResponseModel()
                                                {
                                                    Type = "takeorder",
                                                    Message = "Have you thought of a specific name for this plan? ",
                                                    Attributes = previousTag.Entities
                                                };
                                                previousTag.Entities.questionTag = "Plan Name";
                                            }
                                            AddChatToSession(data.Id, "partnerBundleInputRecommend", "", data.Message, res.Message, previousTag.Entities);
                                            return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                        }
                                        break;
                                    case "competitorplanapproval":
                                    case "partnerbundlefinalconfirmation":
                                        if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                                        {
                                            DetailedView previousTag = previousData.PreviousTag.Last();
                                            if (previousTag.Entities != null)
                                            {
                                                if (previousTag.Entities.orderPos >= 1)
                                                {
                                                    previousTag.Entities.orderPos = 3;
                                                    previousTag.Entities.requestMessg = responseModel.text;
                                                    res = new ChatResponseModel()
                                                    {
                                                        Type = "takeorder",
                                                        Message = "Thanks, Following are the inputs provided by you ",
                                                        Attributes = previousTag.Entities
                                                    };
                                                }
                                                else
                                                {
                                                    previousTag.Entities.orderPos = 1;
                                                    res = new ChatResponseModel()
                                                    {
                                                        Type = "takeorder",
                                                        Message = "Have you thought of a specific name for this plan? ",
                                                        Attributes = previousTag.Entities
                                                    };
                                                    previousTag.Entities.questionTag = "Plan Name";
                                                }
                                                AddChatToSession(data.Id, "partnerbundlefinalconfirmation", "", data.Message, res.Message, previousTag.Entities);
                                                return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                            }
                                        }
                                        break;
                                    case "partnerbundleinputs":
                                        if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                                        {
                                            DetailedView previousTag = previousData.PreviousTag.Last();
                                            if (previousTag.Entities != null)
                                            {
                                                switch (previousTag.Entities.orderPos)
                                                {
                                                    case 0:
                                                        previousTag.Entities.orderPos = 1;
                                                        previousTag.Entities.questionTag = "Data Limit";
                                                        res = new ChatResponseModel()
                                                        {
                                                            Type = "takeorder-user",
                                                            Message = " That’s great, what is the data limit per month? ",
                                                        };
                                                        break;
                                                }
                                                AddChatToSession(data.Id, "partnerbundlefinalconfirmation", "", data.Message, res.Message, previousTag.Entities);
                                                return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                            }
                                        }
                                        break;

                                    case "competitorplantargetlist":
                                        string header = "Subscriber,Mobile Number,Connection Type,Location";
                                        analysis = Settings.mongoUtility.executeQeuryForData<BsonDocument>("{}", "{}", "customers", ref t);
                                        header += string.Join("\n", analysis.Select(x => (x["Subscriber"] + "," + x["Mobile Number"] + "," + x["Connection Type"] + "," + x["Location"])));
                                        res = new ChatResponseModel()
                                        {
                                            Type = "downloadcsv",
                                            Message = header,
                                        };
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));

                                    case "partnerbundledata":
                                    case "partnerbundlevoice":
                                    case "competitorplanprice":
                                    case "targetplanprice":
                                        if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                                        {
                                            DetailedView previousTag = previousData.PreviousTag.Last();
                                            if (previousTag.Entities != null && responseModel.entities != null && responseModel.entities.Count > 0)
                                            {
                                                switch (previousTag.Entities.orderPos)
                                                {
                                                    case 1:
                                                        previousTag.Entities.orderPos = 2;
                                                        previousTag.Entities.requestMessg = responseModel.text;
                                                        res = new ChatResponseModel()
                                                        {
                                                            Type = "takeorder-user",
                                                            Message = "How many voice minutes do you want to include for free as part of this plan? ",
                                                            Attributes = new
                                                            {
                                                                tag = previousTag.Entities.questionTag,
                                                                val = responseModel.entities[0].value
                                                            }
                                                        };
                                                        previousTag.Entities.questionTag = "Voice Minutes";
                                                        break;
                                                    case 2:
                                                        previousTag.Entities.orderPos = 3;
                                                        previousTag.Entities.requestMessg = responseModel.text;
                                                        res = new ChatResponseModel()
                                                        {
                                                            Type = "takeorder-user",
                                                            Message = "What is the target price range for this plan?",
                                                            Attributes = new
                                                            {
                                                                tag = previousTag.Entities.questionTag,
                                                                val = responseModel.entities[0].value
                                                            }
                                                        };
                                                        previousTag.Entities.questionTag = "Price";
                                                        break;
                                                    case 3:
                                                        previousTag.Entities.orderPos = 4;
                                                        previousTag.Entities.requestMessg = responseModel.text;
                                                        res = new ChatResponseModel()
                                                        {
                                                            Type = "takeorder-user",
                                                            Message = "Have you thought of a specific name for this plan? ",
                                                            Attributes = new
                                                            {
                                                                tag = previousTag.Entities.questionTag,
                                                                val = responseModel.entities[0].value
                                                            }
                                                        };
                                                        previousTag.Entities.questionTag = "Plan Name";
                                                        break;
                                                    case 4:
                                                    case 5:
                                                        previousTag.Entities.orderPos = 6;
                                                        previousTag.Entities.requestMessg = responseModel.text;
                                                        previousTag.Entities.value = responseModel.entities[0].value;
                                                        res = new ChatResponseModel()
                                                        {
                                                            Type = "takeorder",
                                                            Message = "Thanks, Following are the inputs provided by you ",
                                                            Attributes = previousTag.Entities
                                                        };
                                                        break;
                                                }

                                                AddChatToSession(data.Id, "partnerbundlefinalconfirmation", "", data.Message, res.Message, previousTag.Entities);
                                                return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                            }
                                        }
                                        break;
                                    case "partnerbundlenaming":
                                        if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                                        {
                                            DetailedView previousTag = previousData.PreviousTag.Last();
                                            if (previousTag.Entities != null && responseModel.entities.Count > 0)
                                            {
                                                previousTag.Entities.orderPos = 3;
                                                previousTag.Entities.inputValue = responseModel.entities[0].value;
                                                previousTag.Entities.value = responseModel.entities[0].value;
                                                res = new ChatResponseModel()
                                                {
                                                    Type = "takeorder",
                                                    Message = "Thanks, Following are the inputs provided by you ",
                                                    Attributes = previousTag.Entities
                                                };
                                                AddChatToSession(data.Id, "partnerbundlenaming", "", data.Message, res.Message, previousTag.Entities);
                                                return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                            }
                                        }
                                        break;
                                    case "competitorplanquestion":
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            Message = " Can you share the Plan name for me to search and analyze ?",
                                        };

                                        AddChatToSession(data.Id, "partnerbundlenaming", "", "", "", new Entities() { questionTag = "CompetitorPlanName" });
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "competitorplan":
                                    case "competitorplannameintent":
                                        //For which competitor's product would you like me to analyze the impact on customer churn?
                                        if (responseModel.entities != null && responseModel.entities.Count > 0)
                                        {
                                            string competitorName = responseModel.entities.Where(x => x.entity == "competitorName").Select(y => y.value).FirstOrDefault();
                                            string competitorPlanName = responseModel.entities.Where(x => x.entity == "competitorPlanName").Select(y => y.value).FirstOrDefault();
                                            if (competitorName != null || competitorPlanName != null)
                                            {
                                                return GetCompetitorPlan(competitorName, competitorPlanName, responseModel.entities[0], data);
                                            }
                                        }
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            Message = "Can you share more details about the plan?",
                                        };
                                        AddChatToSession(data.Id, "partnerbundlenaming", "", "", "", new Entities() { questionTag = "CompetitorPlanName" });
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "competitorplanimpact":
                                        if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                                        {
                                            DetailedView previousTag = previousData.PreviousTag.Last();
                                            if (previousTag.Entities != null)
                                            {
                                                filter = new FilterDefinitionBuilder<BsonDocument>().Regex("Plan Name", new BsonRegularExpression(previousTag.Entities.value, "i"));
                                                List<BsonDocument> analysisde = Settings.mongoUtility.executeQeuryForData<BsonDocument>(filter, "{}", "competitorproduct_analysis", ref t);
                                                if (analysisde.Count > 0)
                                                {
                                                    var analysisdata = analysisde[random.Next(0, analysisde.Count - 1)];
                                                    res = new ChatResponseModel()
                                                    {
                                                        Type = "plain_message",
                                                        ShowAnalyzing = true,
                                                        Message = analysisdata["Analysis"] + "<p>Could you please advise on the next course of action regarding this matter?</p>",
                                                    };
                                                    AddChatToSession(data.Id, "competitorplan", "", "", "", new Entities() { entity = "_id", value = analysisdata["_id"].ToString() });
                                                }
                                                else
                                                {
                                                    res = new ChatResponseModel()
                                                    {
                                                        Type = "plain_message",
                                                        Message = "Sorry failed to analyze",
                                                    };
                                                }
                                            }
                                        }
                                        else
                                        {
                                            res = new ChatResponseModel()
                                            {
                                                Type = "plain_message",
                                                Message = "Can you share more details about the plan?",
                                            };
                                            return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                        }
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "competitorplancounteroffer":
                                    case "countersocialsentiments":
                                        if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                                        {
                                            DetailedView previousTag = previousData.PreviousTag.Last();
                                            if (previousTag.Entities != null)
                                            {
                                                filter = new FilterDefinitionBuilder<BsonDocument>().Eq("_id", BsonObjectId.Parse(previousTag.Entities.value));
                                                List<BsonDocument> counterOffer = Settings.mongoUtility.executeQeuryForData<BsonDocument>(filter, "{}", "competitorproduct_analysis", ref t);
                                                if (counterOffer.Count > 0)
                                                {
                                                    if (responseModel.intent.name.ToLower() == "competitorplancounteroffer")
                                                    {
                                                        res = new ChatResponseModel()
                                                        {
                                                            Type = "plain_message",
                                                            Message = "I suggest two counter strategy to this. <br/> " + counterOffer[0]["counterOffer1"] + "<p>Would you like me to propose additional counter strategies based on the analysis?</p>",
                                                            OrderDetails = JsonConvert.DeserializeObject(counterOffer[0]["competitionProductBundle"].ToJson()),
                                                            CaseType = 2
                                                        };
                                                    }
                                                    else
                                                    {
                                                        res = new ChatResponseModel()
                                                        {
                                                            Type = "plain_message",
                                                            Message = counterOffer[0]["counterOffer2"] + "<p> Sorry if I cannot help with this aspect. Could you kindly suggest the next course of action? </p>",
                                                            OrderDetails = JsonConvert.DeserializeObject(counterOffer[0]["competitionProductBundle"].ToJson()),
                                                        };
                                                    }
                                                }
                                                else
                                                {
                                                    res = new ChatResponseModel()
                                                    {
                                                        Type = "plain_message",
                                                        Message = "Sorry failed to find a counter offer",
                                                    };
                                                }
                                            }
                                        }
                                        return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    case "multiplayofferstart":
                                    case "multiplayintent":
                                    case "bundletype":
                                        return MultiplayStart(data);
                                    case "bundleservices":
                                        if (responseModel.entities != null && responseModel.entities.Count > 0)
                                        {
                                            if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                                            {
                                                DetailedView previousTag = previousData.PreviousTag.Last();
                                                if (previousTag.Entities != null)
                                                {
                                                    previousTag.Entities.value = "Mobile-Internet-TV";
                                                    res = new ChatResponseModel()
                                                    {
                                                        Type = "loading_message",
                                                        Message = "Sure - Let me analyze ",
                                                        APICallData = JsonConvert.SerializeObject(new ChatModel() { Type = "bundledofferanalysis" })
                                                    };
                                                    AddChatToSession(data.Id, "multiplayanalysis", "", "", "", previousTag.Entities);
                                                    return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                                }
                                            }
                                        }
                                        break;
                                    case "bundleservicetv":
                                        if (responseModel.entities != null && responseModel.entities.Count > 0)
                                        {
                                            if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                                            {
                                                DetailedView previousTag = previousData.PreviousTag.Last();
                                                if (previousTag.Entities != null)
                                                {
                                                    res = new ChatResponseModel()
                                                    {
                                                        Type = "loading_message",
                                                        Message = "Sure - Let me analyze ",
                                                        APICallData = JsonConvert.SerializeObject(new ChatModel() { Type = "bundledtvofferanalysis", AnalysisId = previousTag.Entities.analysisId })
                                                    };
                                                    return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                                }
                                            }
                                        }
                                        break;
                                    default:
                                        Logger.Log(content);
                                        return ProcessDeeper(responseModel.intent.name.ToLower(), data);
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            //send message to nlp
            return ResponseModel.getResponse(false, Settings.ErrorMessages[random.Next(0, Settings.ErrorMessages.Length - 1)], null);
        }

        private static string MultiplayStart(ChatModel data)
        {
            var res = new ChatResponseModel()
            {
                Type = "checkbox",
                Message = "Sure which services do you want to Include in the Offer",
                Attributes = new List<object> { { new { Label = "Mobile", Id = "1", ParentId = "Multiplay", Checked= true, Disabled=true } },
                                                                        { new { Label = "Internet", Id = "2", ParentId = "Multiplay" } },
                                                                        { new { Label = "TV", Id = "3", ParentId = "Multiplay" } },
                                                                        { new { Label = "Energy - Upgrade to Product release 25.4 to get this feature", Id = "4", ParentId = "Multiplay", Disabled=true } },
                                                                        { new { Label = "Fixed Line - Upgrade to Product release 25.4 to get this feature", Id = "5", ParentId = "Multiplay", Disabled=true } },
                                                                        },
                APICallData = JsonConvert.SerializeObject(new { Label = "", Id = "2", ParentId = "Multiplay" })
            };
            AddChatToSession(data.Id, "multiplayanalysis", "", "", "", new Entities());
            return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
        }

        private static string GetCompetitorPlan(string? competitorName, string? competitorPlanName, Entities entities, ChatModel data)
        {
            if (!string.IsNullOrWhiteSpace(competitorPlanName))
            {
                FilterDefinition<BsonDocument> filter = new FilterDefinitionBuilder<BsonDocument>().Regex("Plan Name", new BsonRegularExpression(competitorPlanName, "i")); ;
                if (!string.IsNullOrWhiteSpace(competitorName))
                {
                    filter = filter | new FilterDefinitionBuilder<BsonDocument>().Regex("Competitor Name", new BsonRegularExpression(competitorName, "i"));
                }

                long t = 0;
                var analysis = Settings.mongoUtility.executeQeuryForData<BsonDocument>(filter, "{}", "competitor_product", ref t);
                if (analysis.Count > 0)
                {
                    analysis[0].Remove("_id");
                    var res1 = new ChatResponseModel()
                    {
                        Type = "JSON",
                        LoadingMessage = "Alright, I'm currently analyzing the churn impact",
                        ShowAnalyzing = true,
                        Message = "Per my Analysis <b>" + competitorPlanName + "</b>  competitor’s has the following details ",
                        Message2 = "<p>Please specify the analysis you would like me to conduct regarding this competitor's plan.</p>",
                        Attributes = JsonConvert.DeserializeObject(analysis[0].ToJson())
                    };
                    entities.value = competitorPlanName + "";
                    entities.name = "plan name";
                    AddChatToSession(data.Id, "competitorplan", "", "", "", entities);
                    return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res1));
                }
            }
            var res = new ChatResponseModel()
            {
                Type = "plain_message",
                Message = "I am not able to find any info regarding this plan, Can you share more details about the plan?",
            };
            AddChatToSession(data.Id, "partnerbundlenaming", "", "", "", new Entities() { questionTag = "CompetitorPlanName" });
            return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
        }

        private static string GetRDPReply(ChatModel data)
        {
            return OpenAIService.GetRFPResolution(data.Message);
        }



        private static string GetGenAIResponse(string message, bool addpre = true)
        {
            //using (HttpClient client = new HttpClient())
            //{
            //    var request = new HttpRequestMessage(HttpMethod.Post, "https://optivagenai.openai.azure.com/openai/deployments/OptivaAI16k/chat/completions?api-version=2024-02-15-preview");
            //    request.Headers.Add("api-key", "f3a09f4c4714422b9550799bfd069c47");
            //    var messaged = new
            //    {
            //        messages = new[] { new { role = "system", content = "In the answer do not add any document reference like [doc1],[doc2] etc and always give the answer from training documents for the question" }, new { role = "user", content = message } },
            //        past_messages = 10,
            //        max_tokens = 800,
            //        temperature = 0.7,
            //        frequency_penalty = 0,
            //        presence_penalty = 0,
            //        top_p = 0.95
            //    };
            //    var content1 = new StringContent(JsonConvert.SerializeObject(messaged), null, "application/json");
            //    request.Content = content1;
            //    var response = client.SendAsync(request).Result;
            //    response.EnsureSuccessStatusCode();
            //    string content = response.Content.ReadAsStringAsync().Result;
            //    if (!string.IsNullOrWhiteSpace(content))
            //    {
            //        GenAIModel data = JsonConvert.DeserializeObject<GenAIModel>(content);
            //        if (data != null && data.choices.Count > 0
            //            && data.choices[0].messages != null
            //            && data.choices[0].messages.Count > 0
            //            )
            //        {
            //            MessageModel d = data.choices[0].messages[data.choices[0].messages.Count - 1];
            //            string msg = d.content;
            //            Logger.Log("Meraki AI reply -> " + d.content);
            //            for (int i = 0; i < 100; i++)
            //            {
            //                msg = msg.Replace("[doc" + i + "]", "");
            //            }
            //            res = new
            //            {
            //                Type = "plain_message",
            //                Message = msg.Replace("\n", "<br/>"),
            //            };
            //            return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
            //        }
            //    }
            //}

            //string endpoint = "https://optivagenai.openai.azure.com/";
            //string key = "f3a09f4c4714422b9550799bfd069c47";
            //AzureKeyCredential credential = new AzureKeyCredential(key);
            //Azure.AI.OpenAI.AzureOpenAIClient azureClient = new(new Uri(endpoint), credential);
            //ChatClient chatClient = azureClient.GetChatClient("OptivaAI16k");

            //ChatCompletion completion = chatClient.CompleteChat(
            //  new OpenAI.Chat.ChatMessage[] {
            //  new SystemChatMessage("In the answer do not add any document reference like [doc1],[doc2] etc and always give the answer from training documents for the question"),
            //  new UserChatMessage(message),
            //  }
            //);

            var json = new
            {
                corpus = new
                {
                    corpus_name = "projects/296159637085/locations/us-central1/ragCorpora/2842897264777625600"
                },
                query = new
                {
                    question = "You are a customer care support executive. A user has asked a question related to a document we trained you in. Your task is to carefully read the document, summarize its relevant contents, and respond to the user's query accurately and concisely, focusing only on the information contained in the document. Ensure the response is simple, in layman's terms, and easy to follow. Keep the response under 120 words. If the document lacks the necessary details to answer the question, politely inform the user and suggest they provide additional information. Be professional, empathetic, and concise in your response. Ensure the user feels understood and supported. Question : " + message
                }
            };
            return OpenAIService.GetVectorAIResolution(JsonConvert.SerializeObject(json));
            //return ResponseModel.getResponse(false, completion.Content[0].Text, null);
        }

        private static string[] NameIntents = new string[]
        {
            "gb",
            "kb",
            "mb",
            "minutes",
            "minute",
            "min",
            "hours",
            "hour",
           "let’s go with",
           "this name conveys speed as well as giga data.",
           "choose the name",
           "i prefer the name",
           "let's name it",
           "i confirm the name as",
           "go with the product name",
           "i'd go with",
           "i would go with",
           "i would like to go with",
           "keep it",
           "keep",
        };

        private static bool ProcessIfPrecomputed(ChatModel data, out string respn)
        {
            ChatResponseModel res;
            string msg = "";
            foreach (string r in NameIntents)
            {
                msg = data.Message.Replace(r, "", StringComparison.OrdinalIgnoreCase);
            }
            msg = msg.Trim();
            string mesgLower = msg.ToLower();
            if (!string.IsNullOrWhiteSpace(msg) && msg.Split(" ").Length <= 2)
            {
                ChatSessionDetailModel previousData = new ChatSessionDetailModel();
                if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
                {
                    if (previousData != null)
                    {
                        var previousTag = previousData.PreviousTag.LastOrDefault();
                        if (previousTag != null && !string.IsNullOrWhiteSpace(previousTag.Entities.questionTag))
                        {
                            switch (previousTag.Entities.questionTag)
                            {
                                case "Further Inputs":
                                    if (mesgLower == "no" || mesgLower == "nothing" || mesgLower == "none")
                                    {
                                        if (previousTag.Entities.orderPos == 3)
                                        {
                                            previousTag.Entities.requestMessg = data.Message;
                                            res = new ChatResponseModel()
                                            {
                                                Type = "takeorder",
                                                Message = "Thanks, Following are the inputs provided by you ",
                                                Attributes = previousTag.Entities
                                            };
                                        }
                                        else
                                        {
                                            previousTag.Entities.orderPos = 6;
                                            //previousTag.Entities.requestMessg = data.Message;
                                            var e = previousTag.Entities;
                                            e.questionTag = previousTag.Entities.questionTag;
                                            //e.value = data.Message;
                                            res = new ChatResponseModel()
                                            {
                                                Type = "takeorder",
                                                Message = "Thanks, Following are the inputs provided by you ",
                                                Attributes = e
                                            };
                                        }
                                        respn = ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                        previousTag.Entities.questionTag = "Anything Else";
                                        AddChatToSession(data.Id, "partnerbundlefinalconfirmation", "", data.Message, res.Message, previousTag.Entities);
                                        return true;
                                    }
                                    break;
                                case "CompetitorPlanName":
                                    respn = GetCompetitorPlan("", msg, new Entities() { questionTag = "CompetitorPlanName" }, data);
                                    return true;
                                case "Plan Name":
                                    if (previousTag.Entities.orderPos == 1)
                                    {
                                        previousTag.Entities.requestMessg = data.Message;
                                        previousTag.Entities.value = msg;
                                        previousTag.Entities.orderPos = 3;
                                        res = new ChatResponseModel()
                                        {
                                            Type = "takeorder",
                                            Message = "Thanks, Following are the inputs provided by you ",
                                            Attributes = previousTag.Entities
                                        };
                                    }
                                    else
                                    {
                                        previousTag.Entities.orderPos = 6;
                                        previousTag.Entities.value = msg;
                                        res = new ChatResponseModel()
                                        {
                                            Type = "takeorder",
                                            Message = "Thanks, Following are the inputs provided by you ",
                                            Attributes = previousTag.Entities
                                        };
                                    }

                                    respn = ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    AddChatToSession(data.Id, "partnerbundlefinalconfirmation", "", data.Message, res.Message, previousTag.Entities);
                                    return true;
                                case "Anything Else":
                                    if (mesgLower == "no" || mesgLower == "nothing" || mesgLower == "none")
                                    {
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            Message = "Thank you",
                                        };
                                        RemoveChatFromSession(data.Id);
                                        respn = ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                        return true;
                                    }
                                    else if (msg == "yes")
                                    {
                                        res = new ChatResponseModel()
                                        {
                                            Type = "plain_message",
                                            Message = "How can I help you?",
                                        };
                                        RemoveChatFromSession(data.Id);
                                        respn = ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                        return true;
                                    }
                                    break;
                            }
                            switch (previousTag.Entities.orderPos)
                            {
                                case 1:
                                    previousTag.Entities.orderPos = 2;
                                    previousTag.Entities.requestMessg = data.Message;
                                    res = new ChatResponseModel()
                                    {
                                        Type = "takeorder-user",
                                        Message = "How many voice minutes do you want to include for free as part of this plan? ",
                                        Attributes = new
                                        {
                                            tag = previousTag.Entities.questionTag,
                                            val = msg
                                        }
                                    };
                                    previousTag.Entities.questionTag = "Voice Minutes";
                                    AddChatToSession(data.Id, "partnerbundlefinalconfirmation", "", data.Message, res.Message, previousTag.Entities);
                                    respn = ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    return true;
                                case 2:
                                    previousTag.Entities.orderPos = 3;
                                    previousTag.Entities.requestMessg = data.Message;
                                    res = new ChatResponseModel()
                                    {
                                        Type = "takeorder-user",
                                        Message = "What is the target price range for this plan?",
                                        Attributes = new
                                        {
                                            tag = previousTag.Entities.questionTag,
                                            val = msg
                                        }
                                    };
                                    previousTag.Entities.questionTag = "Price";
                                    AddChatToSession(data.Id, "partnerbundlefinalconfirmation", "", data.Message, res.Message, previousTag.Entities);
                                    respn = ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    return true;
                                case 3:
                                    previousTag.Entities.orderPos = 4;
                                    previousTag.Entities.requestMessg = data.Message;
                                    res = new ChatResponseModel()
                                    {
                                        Type = "takeorder-user",
                                        Message = "Have you thought of a specific name for this plan? ",
                                        Attributes = new
                                        {
                                            tag = previousTag.Entities.questionTag,
                                            val = msg
                                        }
                                    };
                                    previousTag.Entities.questionTag = "Plan Name";
                                    AddChatToSession(data.Id, "partnerbundlefinalconfirmation", "", data.Message, res.Message, previousTag.Entities);
                                    respn = ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    return true;
                                case 5:
                                case 4:
                                    previousTag.Entities.orderPos = 6;
                                    previousTag.Entities.requestMessg = data.Message;
                                    previousTag.Entities.value = msg;
                                    res = new ChatResponseModel()
                                    {
                                        Type = "takeorder",
                                        Message = "Thanks, Following are the inputs provided by you ",
                                        Attributes = previousTag.Entities
                                    };
                                    AddChatToSession(data.Id, "partnerbundlefinalconfirmation", "", data.Message, res.Message, previousTag.Entities);
                                    respn = ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                                    return true;
                            }
                        }
                    }
                }
            }
            respn = "";
            switch (data.Message)
            {
                case "Digital Service and Churn":
                    res = new ChatResponseModel()
                    {
                        Type = "plain_message",
                        Message = "How can I assist you today? Please feel free to ask your question or share any information you'd like assistance with",
                    };
                    respn = ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                    return true;
                    //case "I want to create a multiplay bundled offer":
                    //    res = new ChatResponseModel()
                    //    {
                    //        Type = "plain_message",
                    //        Message = "What services do you want to include?",
                    //    };
                    //    respn = ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                    //    return true;
            }
            return false;
        }

        private static string ProcessDeeper(string text, ChatModel data)
        {
            ChatSessionDetailModel previousData = new ChatSessionDetailModel();
            if (ChatSessionDetails.TryGetValue(data.Id, out previousData))
            {
                DetailedView previousTag = previousData.PreviousTag.Last();
                switch (previousData.MainStream)
                {
                    case "catalogtype":
                        switch (previousTag.intentName)
                        {
                            case "catalogtype":
                                FilterDefinition<BsonDocument> filter = new FilterDefinitionBuilder<BsonDocument>().Regex("Category Name", new BsonRegularExpression(text, "i"));
                                long t = 0;
                                List<BsonDocument> cateDetails = Settings.mongoUtility.executeQeuryForData(filter, "{}", "category_details", ref t);
                                var res = new
                                {
                                    Type = "card",
                                    Message = "",
                                    Attributes = cateDetails.Select(x => new { Title = x["Product Name"], Desc = x["Product Description"], OtherDetails = JsonConvert.SerializeObject(x) })
                                };
                                AddChatToSession(data.Id, "", "", "", "", null);
                                return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                            case "category_selected":

                                break;

                        }
                        break;
                    case "competitor":
                        break;
                    case "segment":
                        break;
                }
            }

            return ResponseModel.getResponse(false, "I am Sorry for not able to understand you, can you repharse your question.", null);
        }

        private static void RemoveChatFromSession(string id)
        {
            ChatSessionDetailModel model = new ChatSessionDetailModel();
            ChatSessionDetails.TryRemove(id, out model);
        }

        private static void AddChatToSession(string id, string intentName, string mainStreamName, string request, string responce, Entities entities, object data = null)
        {
            ChatSessionDetailModel model = new ChatSessionDetailModel();
            if (ChatSessionDetails.TryGetValue(id, out model))
            {
                DetailedView d = new DetailedView()
                {
                    intentName = intentName,
                    Entities = entities,
                    Data = data,
                    Request = request,
                    Response = responce
                };
                model.PreviousTag.Add(d);
                ChatSessionDetails[id] = model;
            }
            else
            {
                model = new ChatSessionDetailModel();
                DetailedView d = new DetailedView()
                {
                    intentName = intentName,
                    Entities = entities,
                    Request = request,
                    Response = responce
                };
                model.PreviousTag = new List<DetailedView>() { d };
                ChatSessionDetails.TryAdd(id, model);
                model.MainStream = mainStreamName;
            }
        }


    }
}
