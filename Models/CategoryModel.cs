using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class CategoryModel
    {
        [BsonIgnoreIfNull]
        [BsonElement("name")]
        public string CategoryName { get; set; }

        [BsonIgnoreIfNull]
        [BsonElement("description")]
        public string CategoryDesc { get; set; }

        [BsonIgnoreIfNull]
        [BsonElement("_id")]
        public string Id { get; set; } = "";

        [BsonElement("parentId")]
        [BsonIgnoreIfNull]
        public string ParentId { get; set; }
        public DateTime CreateOn { get; set; }
        public string AccountId { get; set; }
    }

    
}
