using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class ConsoleLogsModel
    {
        [BsonIgnoreIfNull]
        [BsonElement("_id")]
        public dynamic Id;
        [BsonIgnoreIfNull]
        [BsonElement("time_stamp")]
        public dynamic TimeStamp;
        [BsonIgnoreIfNull]
        [BsonElement("console_logs")]
        public dynamic ConsoleLogs;
        [BsonIgnoreIfNull]
        [BsonElement("account_id")]
        public string AccountId;
        [BsonIgnoreIfNull]
        [BsonElement("created_date")]
        public dynamic CreatedDate;
    }
}
