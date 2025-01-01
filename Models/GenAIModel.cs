using System;
using System.Collections.Generic;
using System.Reflection.Metadata;
using System.Text;

namespace Models
{
    public class GenAIModel
    {
        public string id { get; set; }
        public List<ChoicesModel> choices { get; set; }

    }

    public class ChoicesModel
    {
        public string finish_reason { get; set; }
        public int index { get; set; }
        public List<MessageModel> messages { get; set; }
    }

    public class MessageModel
    {
        public string role { get; set; }
        public string content { get; set; }

        public Context context { get; set; }
    }

    public class Context
    {
        public List<Citiations> citations { get; set; }
    }
    public class Citiations
    {
        public string content { get; set; }
        public string title { get; set; }
        public string url { get; set; }
        public string filepath { get; set; }
        public string chunk_id { get; set; }
    }

}
