using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Models
{
    public class ForgotPasswordModel
    {
        [BsonElement("email_id")]
        public string EmailId;
        [BsonElement("_id")]
        public string Id;
        [BsonElement("datetime")]
        public DateTime DateTime;
        [BsonElement("first_name")]
        public string FirstName;
        [BsonElement("account_id")]
        public string AccountId;
        [BsonElement("user_id")]
        public string UserId;
        public string NewPassword;
    }
}
