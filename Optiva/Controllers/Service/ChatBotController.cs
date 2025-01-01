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
    public class ChatBotController : ControllerBase
    {
        [HttpPost]
        public object Post()
        {
            ChatModel data = Utility.GetDataFromBody<ChatModel>(HttpContext);
            if (data != null)
            {
                return ChatBotService.ProcessMessage(data);
            }
            return null;
        }
    }
}
