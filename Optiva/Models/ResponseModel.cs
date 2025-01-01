using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Models
{
    public class ResponseModel
    {
        public bool isSucess;
        public string message;
        public object data;

        public  ResponseModel(bool isSuccess, string message, object data)
        {
            this.isSucess = isSuccess;
            this.message = message;
            this.data = data;
        }

        public static string getResponse(bool isSuccess, string message, object data)
        {
            return JsonConvert.SerializeObject(new ResponseModel(isSuccess, message, data));
        }
    }


    public class ChatResponseModel
    {
        public string Message;
        public string Message2;
        public string Type;
        public object data;
        public int CaseType = 0;
        public dynamic Attributes { get; internal set; }
        public string APICallData { get; internal set; }
        public bool ShowAnalyzing { get; internal set; }
        public string LoadingMessage { get; internal set; }
        public object OrderDetails { get; internal set; }
    }
}
