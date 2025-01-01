using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace CommonUtility
{
    public class MongoDbUtility
    {

        private MongoClientSettings clientSettings = null;
        private string connectionString = "";
        private bool useConnectionPooling;
        private string mongoDBName;
        public List<T> executeQeuryForData<T>(FilterDefinition<T> filter,
            ProjectionDefinition<T> projection,
            string collectionName, ref long totalRows, SortDefinition<T> sortOrder = null,
            int limit = -1, int offset = 0, bool readFromPrimary = false)
        {
            var client = getMongoClientConnection();
            if (readFromPrimary)
            {
                MongoClientSettings settings = client.WithReadPreference(ReadPreference.Primary).Settings;
                client = new MongoClient(settings);
            }
            var db = client.GetDatabase(mongoDBName);
            var collection = db.GetCollection<T>(collectionName);
            var queryinfo = collection.Find(filter);
            if (projection != null)
            {
                queryinfo = queryinfo.Project<T>(projection);
            }
            if (sortOrder != null)
            {
                queryinfo = queryinfo.Sort(sortOrder);
            }
            totalRows = queryinfo.Count();
            if (limit == -1)
            {
                return queryinfo.ToList();
            }
            else
            {
                return queryinfo.Skip((offset * limit)).Limit(limit).ToList();
            }
        }

        public List<T> executeQeuryForDataWithLookUp<T>(FilterDefinition<BsonDocument> filter,
            ProjectionDefinition<BsonDocument, T> projection,
            string collectionName, string foreignCollection, string localField, string foreignField,
            string alias,  ref long totalRows, SortDefinition<T> sortOrder = null,
            int limit = -1, int offset = 0, bool readFromPrimary = false)
        {
            var client = getMongoClientConnection();
            if (readFromPrimary)
            {
                MongoClientSettings settings = client.WithReadPreference(ReadPreference.Primary).Settings;
                client = new MongoClient(settings);
            }
            var db = client.GetDatabase(mongoDBName);
            var collection = db.GetCollection<BsonDocument>(collectionName);
            var queryinfo = collection.Aggregate().Match(filter).Lookup(foreignCollection, localField, foreignField, alias)
                .Project(projection).Sort(sortOrder);
            var totalRows1 = queryinfo.Count().ToList().FirstOrDefault();
            if (limit == -1)
            {
                return queryinfo.ToList();
            }
            else
            {
                return queryinfo.Skip((offset * limit)).Limit(limit).ToList();
            }
        }

        public long executeQeuryForCount<T>(FilterDefinition<T> filter, string collectionName)
        {
            var client = getMongoClientConnection();
            var db = client.GetDatabase(mongoDBName);
            var collection = db.GetCollection<T>(collectionName);
            return collection.CountDocuments(filter);
        }


        public bool executeQeuryForInsert<T>(List<T> data, string collectionName)
        {
            var client = getMongoClientConnection();
            var db = client.GetDatabase(mongoDBName);
            var collection = db.GetCollection<T>(collectionName);
            if (data.Count > 1)
            {
                InsertManyOptions options = new InsertManyOptions();
                options.IsOrdered = false;//testing performance
                collection.InsertMany(data, options);
            }
            else if (data.Count == 1)
            {
                collection.InsertOne(data[0]);
            }
            return true;
        }

        public long executeQeuryForUpdateMany(BsonDocument data, FilterDefinition<BsonDocument> filter, string collectionName)
        {
            var client = getMongoClientConnection();
            var db = client.GetDatabase(mongoDBName);
            var collection = db.GetCollection<BsonDocument>(collectionName);
            UpdateDefinition<BsonDocument> updatedoc = new BsonDocument() { { "$set", data } };

            if (data != null)
            {
                var obj = new UpdateOptions();
                obj.IsUpsert = false;
                UpdateResult result = collection.UpdateMany(filter, updatedoc, obj);
                return result.ModifiedCount;
            }
            return -1;
        }

        public long executeQeuryForUpdateOne(string collectionName, BsonDocument data, FilterDefinition<BsonDocument> filter)
        {
            var client = getMongoClientConnection();
            var db = client.GetDatabase(mongoDBName);
            var collection = db.GetCollection<BsonDocument>(collectionName);
            UpdateDefinition<BsonDocument> updatedoc = new BsonDocument() { { "$set", data } };
            if (data != null)
            {
                var obj = new UpdateOptions();
                obj.IsUpsert = false;
                var updateresult = collection.UpdateOne(filter, updatedoc, obj);
                return updateresult.ModifiedCount;
            }
            return -1;
        }

        public long executeQeuryForUpsertWithNoSet(BsonDocument data, FilterDefinition<BsonDocument> filter, string collectionName)
        {
            var client = getMongoClientConnection();
            var db = client.GetDatabase(mongoDBName);
            var collection = db.GetCollection<BsonDocument>(collectionName);

            if (data != null)
            {
                var obj = new UpdateOptions();
                obj.IsUpsert = true;
                var updateresult = collection.UpdateOne(filter, data, obj);
                return updateresult.ModifiedCount;
            }
            return -1;
        }

        public long executeQeuryForUpsert(BsonDocument data, FilterDefinition<BsonDocument> filter, string collectionName)
        {
            var client = getMongoClientConnection();
            var db = client.GetDatabase(mongoDBName);
            var collection = db.GetCollection<BsonDocument>(collectionName);
            UpdateDefinition<BsonDocument> updatedoc = new BsonDocument() { { "$set", data } };

            if (data != null)
            {
                var obj = new UpdateOptions();
                obj.IsUpsert = true;
                var updateresult = collection.UpdateOne(filter, updatedoc, obj);
                return updateresult.ModifiedCount;
            }
            return -1;
        }

        public long executeQueryForDeleteOne(FilterDefinition<BsonDocument> filter, string collectionName)
        {
            var client = getMongoClientConnection();
            var db = client.GetDatabase(mongoDBName);
            var collection = db.GetCollection<BsonDocument>(collectionName);
            var result = collection.DeleteOne(filter);
            return result.DeletedCount;
        }

        public long executeQueryForDeleteMany(FilterDefinition<BsonDocument> filter, string collectionName)
        {
            var client = getMongoClientConnection();
            var db = client.GetDatabase(mongoDBName);
            var collection = db.GetCollection<BsonDocument>(collectionName);
            var result = collection.DeleteMany(filter);
            return result.DeletedCount;
        }

        public int getDBVersion()
        {
            var proj = Builders<BsonDocument>.Projection.Include("database_version").Exclude("_id");
            var client = getMongoClientConnection();
            var db = client.GetDatabase(mongoDBName);
            var collection = db.GetCollection<BsonDocument>("appversion");
            var queryinfo = collection.Find(new BsonDocument()).Project(proj);
            List<BsonDocument> doc = queryinfo.Skip(0).Limit(1).ToList();
            if (doc != null && doc.Count > 0)
            {
                BsonValue val = doc[0]["database_version"];
                if (val != null)
                {
                    return int.Parse(val.ToString());
                }
            }
            return 1;
        }

        public void SetMongoConnectionSettings(string connectionString, int maxConnectionPool,
            int maxWaitQueueSize, string readNodeTagName, string mongdbname, bool useConnectionPooling = true)
        {
            this.connectionString = connectionString;
            this.useConnectionPooling = useConnectionPooling;
            mongoDBName = mongdbname;
            if (useConnectionPooling)
            {

                clientSettings = MongoClientSettings.FromConnectionString(connectionString);
                clientSettings.MaxConnectionPoolSize = maxConnectionPool;
                clientSettings.ReadPreference = ReadPreference.Secondary.With(new TagSet[]  {
                                                new TagSet(new List<Tag> { new Tag("nodeType", readNodeTagName) })
                                             });
                clientSettings.WaitQueueSize = maxWaitQueueSize;
            }
        }

        public MongoClient getMongoClientConnection()
        {
            if (useConnectionPooling && clientSettings != null)
            {
                return new MongoClient(clientSettings);
            }
            return new MongoClient(connectionString);
        }


        public static dynamic getPercent(string total, string used)
        {
            try
            {
                double available = double.Parse(total);
                double consumed = double.Parse(used);
                return (int)((consumed / available) * 100);
            }
            catch (Exception ex)
            { }
            return -1;
        }
        public static long getlongValueFormated(string value)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    return long.Parse(value, CultureInfo.InvariantCulture.NumberFormat);
                }
            }
            catch (Exception)
            {
            }
            return 0;
        }

        public static float getFloatValueFormated(string value)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    return float.Parse(value, CultureInfo.InvariantCulture.NumberFormat);
                }
            }
            catch (Exception)
            {
            }
            return 0;
        }
        public static int getIntValueFormated(string value)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    return int.Parse(value);
                }
            }
            catch (Exception)
            {
            }
            return 0;
        }

        public long executeQeuryForUpdateWithNoSetForMany(BsonDocument data, FilterDefinition<BsonDocument> filter, string collectionName)
        {
            var client = getMongoClientConnection();
            var db = client.GetDatabase(mongoDBName);
            var collection = db.GetCollection<BsonDocument>(collectionName);

            if (data != null)
            {
                var obj = new UpdateOptions();
                obj.IsUpsert = false;
                var updateresult = collection.UpdateMany(filter, data, obj);
                return updateresult.ModifiedCount;
            }
            return 0;
        }

        public long executeQeuryForUpdateWithNoSet(string collectionName, BsonDocument data, FilterDefinition<BsonDocument> filter)
        {
            var client = getMongoClientConnection();
            var db = client.GetDatabase(mongoDBName);
            var collection = db.GetCollection<BsonDocument>(collectionName);

            if (data != null)
            {
                var obj = new UpdateOptions();
                obj.IsUpsert = false;
                var updateresult = collection.UpdateOne(filter, data, obj);
                return updateresult.ModifiedCount;
            }
            return 0;
        }

        public long BulkUpdate(string collectionName, List<UpdateOneModel<BsonDocument>> updateOneModels, bool isOrdered)
        {
            var client = getMongoClientConnection();
            var db = client.GetDatabase(mongoDBName);
            var collection = db.GetCollection<BsonDocument>(collectionName);
            BulkWriteOptions writeOptions = new BulkWriteOptions();
            writeOptions.IsOrdered = isOrdered;
            var result = collection.BulkWrite(updateOneModels, writeOptions);
            return result.ModifiedCount;
        }

        public static int getBoolValueFormated(bool value)
        {
            try
            {
                return value == true ? 1 : 0;
            }
            catch (Exception ex)
            {
            }
            return 0;
        }

        public static dynamic getDoubleValueFormated(string value)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    return double.Parse(value, CultureInfo.InvariantCulture.NumberFormat);
                }
                else
                {
                    return "";
                }
            }
            catch (Exception)
            {
            }
            return value;
        }


        public static string getStringValueFormated(string value, string def = "")
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                return value;
            }
            else if (!string.IsNullOrWhiteSpace(def))
            {
                return def;
            }
            return "N/A";
        }

        public static BsonDateTime getDateTimeValueFormated(DateTime value)
        {
            return new BsonDateTime(value);
        }




    }
}
