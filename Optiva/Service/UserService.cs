using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonUtility;

namespace Optiva.Service
{
    public class UserService
    {
        public static string GetUserDetailList(UserModel userDetails, GridModel grid)
        {
            try
            {
                FilterDefinition<UserModel> filter = new FilterDefinitionBuilder<UserModel>().Eq(x => x.AccountId, userDetails.AccountId);
                long totalRows = 0;
                if (string.IsNullOrWhiteSpace(grid.sortCol))
                {
                    grid.sortCol = "created_date";
                }
                SortDefinition<UserModel> sort = "{" + grid.sortCol + ":" + grid.sortOrder + " }";
                if (!string.IsNullOrWhiteSpace(grid.searchVal))
                {
                    var filterbuilder = new FilterDefinitionBuilder<UserModel>();
                    filter = filter &
                        (
                          filterbuilder.Regex(x => x.FirstName, new BsonRegularExpression(grid.searchVal, "i"))
                        | filterbuilder.Regex(x => x.EmailId, new BsonRegularExpression(grid.searchVal, "i"))
                        );
                }
                List<UserModel> Users = Settings.mongoUtility.executeQeuryForData<UserModel>(filter, null, "users", ref totalRows, sort, grid.limit, grid.start);
                if (Users != null)
                {
                    return JsonConvert.SerializeObject(new { rows = Users, totalRows = totalRows });
                }
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return null;
        }

        internal static string AddorEditUser(UserModel UserDetails, UserModel sessionUserDetails)
        {
            try
            {
                if (UserDetails != null && !string.IsNullOrWhiteSpace(UserDetails.EmailId) && !string.IsNullOrWhiteSpace(UserDetails.FirstName))
                {
                    if (string.IsNullOrWhiteSpace(UserDetails.Id))
                    {
                       
                        UserDetails.CreatedDate = DateTime.UtcNow;
                        UserDetails.Id = Guid.NewGuid().ToString();
                        UserDetails.AccountId = sessionUserDetails.AccountId;
                        UserDetails.Status = "Verification Pending";
                        Settings.mongoUtility.executeQeuryForInsert<UserModel>(new List<UserModel>() { UserDetails }, "users");
                    }
                    else
                    {
                        BsonObjectId id = null;
                        BsonObjectId.TryParse(UserDetails.Id, out id);
                        FilterDefinition<BsonDocument> filter = new FilterDefinitionBuilder<BsonDocument>().Eq("_id", UserDetails.Id);
                        if (id != null)
                        {
                            filter = filter | new FilterDefinitionBuilder<BsonDocument>().Eq("_id", id);
                        }
                        try
                        {
                            BsonDocument doc = UserDetails.ToBsonDocument();
                            doc.Remove("_id");
                            Settings.mongoUtility.executeQeuryForUpdateOne("users", doc, filter);
                        }
                        catch (Exception e)
                        {
                            //Settings.mongoUtility.executeQueryForDeleteOne(filter, "users");
                            //UserDetails._id = null;
                            //AddorEditUser(UserDetails, userDetails);
                        }
                    }
                    return ResponseModel.getResponse(true, "Success", null);
                }
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return ResponseModel.getResponse(false, "Failed", null);
        }

        internal static string DeleteUser(string id, UserModel userDetails)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(id))
                {
                    var filter = new FilterDefinitionBuilder<BsonDocument>().Eq("user_id", id);
                    if (userDetails != null)
                    {
                        Settings.mongoUtility.executeQueryForDeleteOne(filter, "users");
                    }
                    return ResponseModel.getResponse(true, "Success", null);
                }
            }
            catch (Exception e)
            {

                Logger.Log(e);
            }
            return ResponseModel.getResponse(false, "Failed", null);
        }

        internal static string EditUser(string id, UserModel user)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(id) && !string.IsNullOrWhiteSpace(user.EmailId) && !string.IsNullOrWhiteSpace(user.FirstName))
                {
                    var filter = new FilterDefinitionBuilder<BsonDocument>().Eq("user_id", id);
                    BsonDocument doc = new BsonDocument()
                    {
                        {"email_id" ,user.EmailId},
                        {"first_name" , user.FirstName},
                        {"last_name" , user.LastName },
                        {"password" , user.Password },
                        {"phone" , user.Phone},
                        {"user_type" , "User" },
                        {"status" , user.Status },
                    };
                    Settings.mongoUtility.executeQeuryForUpdateOne("users", doc, filter);
                    return ResponseModel.getResponse(true, "Success", null);
                }
            }
            catch (Exception e)
            {

                Logger.Log(e);
            }
            return ResponseModel.getResponse(false, "Failed", null);
        }
      
    }
}
