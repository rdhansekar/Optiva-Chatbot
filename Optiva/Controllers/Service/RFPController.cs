using Models;
using CommonUtility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Optiva;
using Optiva.Service;

namespace Optiva.Controllers.Service
{
    [Route("api/[controller]")]
    [ApiController]
    public class RFPController : ControllerBase
    {
        [HttpPost]
        public object Post()
        {
            ChatModel data = Utility.GetDataFromBody<ChatModel>(HttpContext);
            UserModel user = AuthenticateUser.GetUserDetailsFromSession();
            if (user != null && data != null)
            {
                data.Type = "RFP";
                return ChatBotService.ProcessMessage(data);
            }
            return null;
        }
    }
}
