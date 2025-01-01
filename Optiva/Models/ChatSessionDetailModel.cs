using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class ChatSessionDetailModel
    {
        public List<DetailedView> PreviousTag;
        public string MainStream;
    }

    public class DetailedView
    {
        public string key;
        public string intentName;
        public Entities Entities;
        public dynamic Data;

        public string Request { get; internal set; }
        public string Response { get; internal set; }
    }
}
