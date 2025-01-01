using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Optiva.Controllers.Session
{
    [Route("api/[controller]")]
    [ApiController]
    [AuthenticateUser]
    public class VersionController : ControllerBase
    {
        [HttpGet]
        public string Get()
        {
            return "1";
        }

    }
}
