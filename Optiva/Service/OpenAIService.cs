using Models;
using Newtonsoft.Json;
using TelcoX;
using System.Text;
using CommonUtility;
using System.Text.RegularExpressions;
using Optiva;
using System;

namespace TelcoX.Service
{
    public class OpenAIService
    {
        private readonly HttpClient _httpClient;

        public OpenAIService(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        public static async Task<string> GetPromptResolution(List<MessageModel> mesg, int retryCount = 0)
        {
            try
            {
                if (retryCount > 5)
                {
                    return null;
                }
                var requestBody = new OpenAIChatModel
                {
                    messages = mesg,
                };

                var requestContent = new StringContent(JsonConvert.SerializeObject(requestBody), null, "application/json");
                using (var _httpClient = new HttpClient())
                {
                    _httpClient.DefaultRequestHeaders.Clear();
                    _httpClient.DefaultRequestHeaders.Add("api-key", Settings.GenAIKey);
                    _httpClient.Timeout = TimeSpan.FromSeconds(5);
                    var response = await _httpClient.PostAsync(Settings.GenAIServerURL, requestContent);
                    if (response.IsSuccessStatusCode)
                    {
                        var responseContent = await response.Content.ReadAsStringAsync();
                        ChatCompletionResponse data = JsonConvert.DeserializeObject<ChatCompletionResponse>(responseContent);
                        if (data != null && data.choices != null && data.choices.Count > 0)
                        {
                            var choice = data.choices[0];
                            if (choice.message != null && !string.IsNullOrWhiteSpace(choice.message.content))
                            {
                                return choice.message.content;
                                // try
                                // {
                                //     ContentModel content = JsonConvert.DeserializeObject<ContentModel>(choice.message.content);
                                //     if (content != null)
                                //     {
                                //         if ((content.usermessageintent == null && content.bestreply.Contains("usermessageintent")) || content.bestreply.Contains("bestreply"))
                                //         {
                                //             content = JsonConvert.DeserializeObject<ContentModel>(content.bestreply);
                                //         }
                                //         return content;
                                //     }
                                // }
                                // catch (Exception e)
                                // {
                                //     Logger.Log(choice.message.content);
                                //     Logger.Log(e);
                                //     var d = TryParsingMessage(choice.message.content);
                                //     if (d != null)
                                //         return d;
                                //     else
                                //     {
                                //         mesg[mesg.Count - 1].content = mesg[mesg.Count - 1].content + ". Your previoius reply `" + choice.message.content + "` to this message is invalid json. Please provide proper json reply.";
                                //         return GetPromptResolution(mesg, ++retryCount).Result;
                                //     }

                                // }
                            }
                        }
                    }
                    else
                    {
                        var responseContent = await response.Content.ReadAsStringAsync();
                        Logger.Log($"API request failed with status code {response.StatusCode}: {responseContent}");
                    }
                }
            }
            catch (Exception e)
            {
                return GetPromptResolution(mesg, ++retryCount).Result;
            }
            return GetPromptResolution(mesg, ++retryCount).Result;
        }

        internal static string GetRFPResolution(string message)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    Uri url = new Uri("http://20.22.232.60:8001/query/");
                    var requestBody = new
                    {
                        message = message,
                    };
                    var requestContent = new StringContent(JsonConvert.SerializeObject(requestBody), null, "application/json");
                    using (var _httpClient = new HttpClient())
                    {
                        var response = _httpClient.PostAsync(url, requestContent).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var content = response.Content.ReadAsStringAsync().Result;
                            if (!string.IsNullOrWhiteSpace(content))
                            {
                                Logger.Log("Got response from python qna app " + content);
                                ChatCompletionResponse data = JsonConvert.DeserializeObject<ChatCompletionResponse>(content);
                                if (data != null && data.model_response != null && !string.IsNullOrWhiteSpace(data.model_response.content))
                                {
                                    var res = new ChatResponseModel()
                                    {
                                        Type = "plain_message",
                                        Message = data.model_response.content.Replace("\n", "<br/>").Split("Description:")[1].Split("5. Reference Document")[0].Replace("fully complying with the user query", "").Split(", which fully complies with the user query")[0].Split(", thus of fully complies with the user query")[0]
                                    };
                                    return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
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
            var res1 = new ChatResponseModel()
            {
                Type = "plain_message",
                Message = "I am Sorry for not able to understand you, can you repharse your question."
            };
            return ResponseModel.getResponse(false, "", res1);
        }

        internal static string GetVectorAIResolution(string message)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    Uri url = new Uri("http://52.172.237.248:8001/qna/");
                    var requestContent = new StringContent(message, null, "application/json");
                    using (var _httpClient = new HttpClient())
                    {
                        var response = _httpClient.PostAsync(url, requestContent).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var content = response.Content.ReadAsStringAsync().Result;
                            if (!string.IsNullOrWhiteSpace(content))
                            {
                                Logger.Log("Got response from python vectorai app " + content);
                                string pattern = @"\*\*(.*?)\*\*";
                                string replacement = "<b>$1</b>";
                                content = content.Replace("\\n", "<br/>").Trim('"').Replace("##","");
                                content = Regex.Replace(content, pattern, replacement);
                                var res = new ChatResponseModel()
                                {
                                    Type = "plain_message",
                                    Message = content
                                };
                                return ResponseModel.getResponse(true, "", JsonConvert.SerializeObject(res));
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            var res1 = new ChatResponseModel()
            {
                Type = "plain_message",
                Message = "I am Sorry for not able to understand you, can you repharse your question."
            };
            return ResponseModel.getResponse(false, "", res1);
        }
    }

}