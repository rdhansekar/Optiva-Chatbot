using Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Security.Principal;
using System.Text;
using System.Threading;
using AppContext = Optiva.AppContext;

namespace Optiva
{
    public class AuthenticateUser : ActionFilterAttribute
    {
        public static void SaveUserInSession(string userDetails)
        {
            var session = AppContext.Current.Session;
            session.SetString("UserSessionDetails", userDetails);
            var d = session.GetString("UserSessionDetails");
        }

        public static UserModel GetUserDetailsFromSession()
        {
            var session = AppContext.Current.Session;
            if (AppContext.Current.Request.IsLocal())
            {
                return new UserModel()
                {
                    ProfilePic = "",
                    Id = "123",
                    UserId = "ganeshkiran027@gmail.com",
                    AccountId = "1123",
                    CreatedDate = "12-12-2022",
                    EmailId = "ganeshkiran027@gmail.com",
                    FirstName = "Ganesh",
                    LastName = "Kiran",
                    UserType = "Asmin"
                };
            }
            string userDetails = session.GetString("UserSessionDetails");
            if (!string.IsNullOrWhiteSpace(userDetails))
            {
                return JsonConvert.DeserializeObject<UserModel>(userDetails);
            }
            return null;
        }


        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (context.HttpContext.Request.Method != "Options")
            {
                var session = AppContext.Current.Session;
                if (session == null || string.IsNullOrWhiteSpace(session.GetString("UserSessionDetails")))
                {
                    context.HttpContext.Response.StatusCode = 401;
                    return;
                }
                base.OnActionExecuting(context);
            }


        }

        internal static string DeleteSession()
        {
            AppContext.Current.Session.Clear();
            return "true";

        }
    }
}