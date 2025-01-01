using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class ChatModel
    {
        public string Id { get; set; }
        public string Message { get; set; }

        public string Type { get; set; }
        public dynamic Attribute { get; set; }
        public int? AnalysisId { get; set; }
    }
}
