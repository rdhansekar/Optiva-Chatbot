using Models;
using CommonUtility;
using MongoDB.Bson;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using MongoDB.Driver;

namespace Optiva.Service
{
    public class CannedRequestService
    {
        internal static object GetCannedReq(UserModel user, GridModel grid)
        {
            try
            {
                FilterDefinition<CannedRequestModel> filter = new FilterDefinitionBuilder<CannedRequestModel>().Eq("account_id", user.AccountId);
                long totalRows = 0;
                if (string.IsNullOrWhiteSpace(grid.sortCol))
                {
                    grid.sortCol = "request";
                }
                SortDefinition<CannedRequestModel> sort = "{" + grid.sortCol + ":" + grid.sortOrder + " }";
                if (!string.IsNullOrWhiteSpace(grid.searchVal))
                {
                    var filterbuilder = new FilterDefinitionBuilder<CannedRequestModel>();
                    filter = filter &
                        (
                          filterbuilder.Regex(x => x.Request, new BsonRegularExpression(grid.searchVal, "i"))
                          | filterbuilder.Regex(x => x.Response, new BsonRegularExpression(grid.searchVal, "i"))
                          );
                }
                List<CannedRequestModel> document = Settings.mongoUtility.executeQeuryForData<CannedRequestModel>(filter, null, "cannedReq", ref totalRows, sort, grid.limit, grid.start);
                if (document != null && document.Count > 0)
                {
                    return JsonConvert.SerializeObject(new { rows = document, totalRows = totalRows });
                }
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return JsonConvert.SerializeObject(new { rows = new object[] { }, totalRows = 0 });
        }
        internal static string AddOrEditCannedReq(CannedRequestModel cannedReq, UserModel user)
        {
            if (cannedReq != null && !string.IsNullOrWhiteSpace(cannedReq.Request))
            {
                try
                {
                    FilterDefinition<CannedRequestModel> filter = new FilterDefinitionBuilder<CannedRequestModel>().Eq("request", cannedReq.Request)
                                                            & new FilterDefinitionBuilder<CannedRequestModel>().Ne("_id", cannedReq.Id)
                                                            & new FilterDefinitionBuilder<CannedRequestModel>().Eq("account_id", user.AccountId)
                                                            & new FilterDefinitionBuilder<CannedRequestModel>().Eq("response", cannedReq.Response);

                    if (Settings.mongoUtility.executeQeuryForCount<CannedRequestModel>(filter, "cannedReq") == 0)
                    {
                        if (!string.IsNullOrWhiteSpace(cannedReq.Id))
                        {
                            var filter2 = new FilterDefinitionBuilder<BsonDocument>().Eq("account_id", user.AccountId)
                                        & new FilterDefinitionBuilder<BsonDocument>().Eq("_id", cannedReq.Id);

                            BsonDocument doc = new BsonDocument() { { "request", cannedReq.Request }, { "response", cannedReq.Response } };
                            Settings.mongoUtility.executeQeuryForUpdateOne("cannedReq", doc, filter2);
                            return ResponseModel.getResponse(true, "Canned Request updated successfully", null);
                        }
                        else
                        {
                            cannedReq.Id = Guid.NewGuid().ToString();
                            cannedReq.CreateOn = DateTime.UtcNow;
                            cannedReq.AccountId = user.AccountId;
                            Settings.mongoUtility.executeQeuryForInsert<CannedRequestModel>(new List<CannedRequestModel>() { cannedReq }, "cannedReq");
                            return ResponseModel.getResponse(true, "Canned Request added successfully", null);
                        }
                    }
                    else
                    {
                        return ResponseModel.getResponse(false, "Canned Request with same already exist", null);
                    }
                }
                catch (Exception e)
                {
                    Logger.Log(e);
                }
            }
            return null;
        }
        internal static object DeleteCannedReq(UserModel user, string Id)
        {
            try
            {
                FilterDefinition<BsonDocument> filter = new FilterDefinitionBuilder<BsonDocument>().Eq("account_id", user.AccountId)
                                    & new FilterDefinitionBuilder<BsonDocument>().Eq("_id", Id);
                long totalRows = Settings.mongoUtility.executeQueryForDeleteOne(filter, "cannedReq");
                return totalRows > 0;
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return false;
        }


    }
}
