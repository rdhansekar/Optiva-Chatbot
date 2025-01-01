using Models;
using CommonUtility;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
namespace Optiva.Service
{
    public class ConsoleLogsService
    { 
        internal static object GetRequestLogs(UserModel user, GridModel grid)
        {
            try
            {
                FilterDefinition<OrderDetailsModel> filter = null;
                long totalRows = 0;
                if (string.IsNullOrWhiteSpace(grid.sortCol) || grid.sortCol == "CreateOn")
                {
                    grid.sortCol = "created_date";
                }
                SortDefinition<OrderDetailsModel> sort = "{" + grid.sortCol + ":" + grid.sortOrder + " }";
                if (!string.IsNullOrWhiteSpace(grid.searchVal))
                {
                    var filterbuilder = new FilterDefinitionBuilder<OrderDetailsModel>();
                    filter = 
                        (
                          filterbuilder.Regex(x => x.Data, new BsonRegularExpression(grid.searchVal, "i"))
                        );
                }
                List<OrderDetailsModel> Users = Settings.mongoUtility.executeQeuryForData<OrderDetailsModel>(filter == null ? "{}" : filter, null, "productorders", ref totalRows, sort, grid.limit, grid.start);
                if (Users != null)
                {
                    return JsonConvert.SerializeObject(new { data = Users, totalRows = totalRows });
                }
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return null;
        }

        internal static object GetProductCount(UserModel user)
        {
            try
            {
                long PlanCount = Settings.mongoUtility.executeQeuryForCount<BsonDocument>("{}", "productorders");
                long CanReqCount = Settings.mongoUtility.executeQeuryForCount<BsonDocument>("{}", "cannedReq");
                return new
                {
                    PlanCount = PlanCount,
                    CanReqCount = CanReqCount
                };
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return new
            {
                PlanCount = 0,
                CanReqCount = 0
            };
        }


    }
}
