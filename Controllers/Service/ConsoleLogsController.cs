using Optiva.Service;
using Models;
using CommonUtility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Optiva.Controllers.Service
{
    [Route("api/[controller]")]
    [ApiController]
    [AuthenticateUser]
    public class ConsoleLogsController : ControllerBase
    {
        [HttpPost]
        [Route("getconsoleLogs")]
        public object GetConsoleLogs()
        {
            UserModel user = AuthenticateUser.GetUserDetailsFromSession();
            GridModel grid = Utility.GetDataFromBody<GridModel>(HttpContext);
            if (user != null && grid != null)
            {
                return ConsoleLogsService.GetRequestLogs(user, grid);

            }
            return null;
        }

        [HttpGet]
        [Route("getproductcount")]
        public object Get()
        {
            UserModel user = AuthenticateUser.GetUserDetailsFromSession();
            if (user != null)
            {
                return ConsoleLogsService.GetProductCount(user);

            }
            return new
            {
                PlanCount = 0,
                CanReqCount = 0
            };

        }
    }
}