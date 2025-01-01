using Optiva.Service;
using Models;
using CommonUtility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Optiva.Controllers.Products
{
    [Route("api/[controller]")]
    [ApiController]
    [AuthenticateUser]
    public class CategoryController : ControllerBase
    {
        [HttpPost]
        [Route("addcategory")]
        public object Post()
        {
            CategoryModel data  = Utility.GetDataFromBody<CategoryModel>(HttpContext);
            UserModel user =  AuthenticateUser.GetUserDetailsFromSession();
            if(user!= null && data!=null)
            {
                return CategoryService.AddOrEditCategory(data, user);
            }
            return null;
        }

        //[HttpPut]

        //[Route("{id}/{catid}")]
        //public object Put(int id,string catid)
        //{
        //    CategoryModel data = Utility.GetDataFromBody<CategoryModel>(HttpContext);
        //    UserModel user = AuthenticateUser.GetUserDetailsFromSession();
        //    if (user != null && data != null)
        //    {
        //        return CategoryService.ArchiveCategory(catid, id, user);
        //    }
        //    return null;
        //}

        [HttpDelete]
        [Route("deletecategory/{id}")]
        public object GetCategories(string id)
        {
            UserModel user = AuthenticateUser.GetUserDetailsFromSession();
            if (user != null && !string.IsNullOrWhiteSpace(id))
            {
                return CategoryService.DeleteCategory(user, id);

            }
            return null;
        }

        [HttpPost]
        [Route("getcategories")]
        public object GetCategories()
        {
            UserModel user = AuthenticateUser.GetUserDetailsFromSession();
            GridModel grid = Utility.GetDataFromBody<GridModel>(HttpContext);
            if (user != null && grid != null)
            {
                return CategoryService.GetCategories(user, grid);

            }
            return null;
        }
    }
}
