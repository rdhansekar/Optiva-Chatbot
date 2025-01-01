using Models;
using CommonUtility;
using Optiva.Service;
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
    public class SignUpController : ControllerBase
    {
        [HttpGet("{id}")]
        public bool Get(string id)
        {
            return SignUpService.IsEmailIdExists(id);
        }

        [Route("retry")]
        public string Get()
        {
            Microsoft.Extensions.Primitives.StringValues email;
            HttpContext.Request.Query.TryGetValue("email", out email);
            if (!string.IsNullOrWhiteSpace(email))
            {
                return SignUpService.SendVerificationMail(email);
            }
            return "Failed to Send Mail. Please contact contact@nlshelp.com";
        }


        [HttpGet()]
        [Route("verify/{id}")]
        public bool Verify(string id)
        {
            return SignUpService.VerifyAccount(id);
        }
       

        // POST api/<LoginController>
        [HttpPost]
        public string Post()
        {
            UserModel value = Utility.GetDataFromBody<UserModel>(HttpContext);
            if (value != null)
            {
                return SignUpService.AddUser(value);
            }
            return null;
        }



    }
}
