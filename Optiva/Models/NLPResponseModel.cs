using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class NLPResponseModel
    {
        public string text;
        public  IntentModel intent;
        public List<Entities> entities;
    }

    public class IntentModel
    {
        public string name;
        public string confidence;
    }

    public class Entities
    {
        public string name;
        public string confidence;
        public string entity;
        public string start;
        public string end;
        public string confidence_entity;
        public string value;
        public string extractor;
        public int orderPos;
        public string inputValue;
        public string catalogSelected;
        public string requestMessg;
        public string questionTag;
        public int analysisId;
    }

}
