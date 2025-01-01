using Models;
using CommonUtility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Optiva;
using Optiva.Service;

namespace AdminConsole.Controllers.Products
{
    [Route("api/[controller]")]
    [ApiController]
    [AuthenticateUser]
    public class UserController : ControllerBase
    {
        [HttpPost]
        [Route("verifyemail")]
        public object VerifyEmail()
        {
            UserModel data = Utility.GetDataFromBody<UserModel>(HttpContext);
            UserModel user = AuthenticateUser.GetUserDetailsFromSession();
            if (user != null && data != null)
            {
                return SignUpService.IsEmailIdExists(data.EmailId);
            }
            return null;
        }

        [HttpPost]
        [Route("addnewuser")]
        public object Post()
        {
            UserModel data  = Utility.GetDataFromBody<UserModel>(HttpContext);
            UserModel user =  AuthenticateUser.GetUserDetailsFromSession();
            if(user!= null && data!=null)
            {
                return UserService.AddorEditUser(data, user);
            }
            return null;
        }

        [HttpPost]
        [Route("getuserslist")]
        public object GetUsers()
        {
            UserModel user = AuthenticateUser.GetUserDetailsFromSession();
            GridModel grid = Utility.GetDataFromBody<GridModel>(HttpContext);
            if (user != null)
            {
                return UserService.GetUserDetailList(user, grid);

            }
            return null;
        }

        [HttpPut]
        [Route("updateUser")]
        public object UpdateUser()
        {
            UserModel sessionUserDetails = AuthenticateUser.GetUserDetailsFromSession();
            UserModel user = Utility.GetDataFromBody<UserModel>(HttpContext);
            if (user != null && sessionUserDetails != null)
            {
                return UserService.AddorEditUser(user, sessionUserDetails);

            }
            return null;
        }

        [HttpDelete]
        [Route("deleteuser/{id}")]
        public object DeleteUser(string Id)
        {
            UserModel sessionUserDetails = AuthenticateUser.GetUserDetailsFromSession();
            if (!string.IsNullOrWhiteSpace(Id) && sessionUserDetails != null)
            {
                return UserService.DeleteUser(Id, sessionUserDetails);

            }
            return null;
        }

    }
}
