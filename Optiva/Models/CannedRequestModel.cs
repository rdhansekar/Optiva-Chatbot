using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class CannedRequestModel
    {
        [BsonIgnoreIfNull]
        [BsonElement("request")]
        public string Request { get; set; }

        [BsonIgnoreIfNull]
        [BsonElement("response")]
        public string Response { get; set; }

        [BsonIgnoreIfNull]
        [BsonElement("_id")]
        public string Id { get; set; } = "";

        [BsonIgnoreIfNull]
        [BsonElement("account_id")]
        public string AccountId;
     
        public DateTime CreateOn { get; set; }
    }
}
