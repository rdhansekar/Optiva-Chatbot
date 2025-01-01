using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class OrderDetailsModel
    {
        [BsonElement("_id")]
        public dynamic id { get; set; }

        [BsonElement("data")]

        public string Data { get; set; }
        [BsonElement("created_date")]

        public DateTime CreateOn { get; set; }
        [BsonElement("request")]

        public string Request { get; set; }
        [BsonElement("response")]

        public string Response { get; set; }
    }
}
