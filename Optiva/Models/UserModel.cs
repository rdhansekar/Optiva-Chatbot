using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Models
{
    public class UserModel
    {
        [BsonIgnoreIfNull]
        [BsonElement("ProfilePic")]
        public string ProfilePic;
        [BsonIgnoreIfNull]
        [BsonElement("_id")]
        public dynamic Id;
        [BsonIgnoreIfNull]
        [BsonElement("user_id")]
        public dynamic UserId;
        [BsonIgnoreIfNull]
        [BsonElement("account_id")]
        public string AccountId;
        [BsonIgnoreIfNull]
        [BsonElement("created_date")]
        public dynamic CreatedDate;
        [BsonIgnoreIfNull]
        [BsonElement("email_id")]
        public dynamic EmailId;
        [BsonIgnoreIfNull]
        [BsonElement("first_name")]
        public dynamic FirstName;
        [BsonIgnoreIfNull]
        [BsonElement("last_name")]
        public dynamic LastName;
        [BsonIgnoreIfNull]
        [BsonElement("password")]
        public dynamic Password;
        [BsonIgnoreIfNull]
        [BsonElement("dateofbirth")]
        public dynamic DOB;
        [BsonIgnoreIfNull]
        [BsonElement("phone")]
        public dynamic Phone;
        [BsonIgnoreIfNull]
        [BsonElement("status")]
        public dynamic Status;
        [BsonIgnoreIfNull]
        [BsonElement("user_type")]
        public string UserType;
        [BsonIgnoreIfNull]
        [BsonElement("city")]
        public dynamic City;
        [BsonIgnoreIfNull]
        [BsonElement("postcode")]
        public dynamic PostCode;
        [BsonIgnoreIfNull]
        [BsonElement("country")]
        public dynamic Country;
        [BsonIgnoreIfNull]
        [BsonElement("company")]
        public dynamic Company;
        [BsonIgnoreIfNull]
        [BsonElement("address_1")]
        public dynamic Adddress1;
        [BsonIgnoreIfNull]
        [BsonElement("address_2")]
        public dynamic Adddress2;
        [BsonIgnoreIfNull]
        [BsonElement("eula_accepted")]
        public dynamic EulaAccepted;
        [BsonIgnoreIfNull]
        [BsonElement("recieve_newsletters")]
        public dynamic RecieveNewsLetters;
        [BsonIgnoreIfNull]
        [BsonElement("cf_resllerform")]
        public dynamic CFResellerForm;
        [BsonIgnoreIfNull]
        [BsonElement("cf_resllpermit")]
        public dynamic CFResellPermit;
        [BsonIgnoreIfNull]
        [BsonElement("group_id")]
        public string GroupId;
        [BsonIgnoreIfNull]
        [BsonElement("group_name")]
        public dynamic GroupName;
        [BsonIgnoreIfNull]
        [BsonElement("role_template_id")]
        public dynamic RoleTemplateId;
    }
}
