using Models;
using CommonUtility;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Optiva.Service
{
    public class CategoryService
    {
        
        internal static object DeleteCategory(UserModel user, string CatId)
        {
            try
            {
                FilterDefinition<BsonDocument> filter = new FilterDefinitionBuilder<BsonDocument>().Eq("account_id", user.AccountId)
                                                            & new FilterDefinitionBuilder<BsonDocument>().Eq("_id", CatId);
                long totalRows =  Settings.mongoUtility.executeQueryForDeleteOne(filter, "group");
                return totalRows > 0;
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return false;
        }

        internal static object GetCategories(UserModel user,  GridModel grid)
        {
            try
            {
                FilterDefinition<CategoryModel> filter = new FilterDefinitionBuilder<CategoryModel>().Eq("account_id", user.AccountId);
                long totalRows = 0;
                if (string.IsNullOrWhiteSpace(grid.sortCol))
                {
                    grid.sortCol = "category_name";
                }
                SortDefinition<CategoryModel> sort = "{" + grid.sortCol + ":" + grid.sortOrder + " }";
                if (!string.IsNullOrWhiteSpace(grid.searchVal))
                {
                    var filterbuilder = new FilterDefinitionBuilder<CategoryModel>();
                    filter = filter &
                        (
                          filterbuilder.Regex(x => x.CategoryName, new BsonRegularExpression(grid.searchVal, "i"))
                          | filterbuilder.Regex(x => x.CategoryDesc, new BsonRegularExpression(grid.searchVal, "i"))
                          );
                }
                List<CategoryModel> document = Settings.mongoUtility.executeQeuryForData<CategoryModel>(filter, null, "group", ref totalRows, sort, grid.limit, grid.start);
                if (document != null && document.Count > 0)
                {
                    return JsonConvert.SerializeObject(new { rows = document, totalRows = totalRows });
                }
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return null;
        }

        internal static string AddOrEditCategory(CategoryModel group, UserModel user)
        {
            if (group != null && !string.IsNullOrWhiteSpace(group.CategoryName))
            {
                try
                {
                    FilterDefinition<CategoryModel> filter = new FilterDefinitionBuilder<CategoryModel>().Eq("category_name", group.CategoryName)
                                                            & new FilterDefinitionBuilder<CategoryModel>().Ne("_id", group.Id)
                                                            & new FilterDefinitionBuilder<CategoryModel>().Eq("account_id", user.AccountId);

                    if (Settings.mongoUtility.executeQeuryForCount<CategoryModel>(filter, "group") == 0)
                    {
                        if (!string.IsNullOrWhiteSpace(group.Id))
                        {
                            var filter2 = new FilterDefinitionBuilder<BsonDocument>().Eq("account_id", user.AccountId)
                                    & new FilterDefinitionBuilder<BsonDocument>().Eq("_id", group.Id);

                            BsonDocument doc = new BsonDocument() { { "category_name", group.CategoryName }, { "description", group.CategoryDesc } };
                            Settings.mongoUtility.executeQeuryForUpdateOne("group", doc, filter2);
                            return ResponseModel.getResponse(true, "Category updated successfully", null);
                        }
                        else
                        {
                            group.Id = Guid.NewGuid().ToString();
                            group.CreateOn = DateTime.UtcNow;
                            group.AccountId = user.AccountId;
                            Settings.mongoUtility.executeQeuryForInsert<CategoryModel>(new List<CategoryModel>() { group }, "group");
                            return ResponseModel.getResponse(true, "Category added successfully", null);
                        }
                    }
                    else
                    {
                        return ResponseModel.getResponse(false, "Category with same already exist", null);
                    }
                }
                catch (Exception e)
                {
                    Logger.Log(e);
                }
            }
            return null;
        }
    }
}
