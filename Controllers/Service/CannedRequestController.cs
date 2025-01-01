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
    public class CannedRequestController: ControllerBase
    {
     [HttpPost]
    [Route("addcannedReq")]
    public object Post()
    {
        CannedRequestModel data = Utility.GetDataFromBody<CannedRequestModel>(HttpContext);
        UserModel user = AuthenticateUser.GetUserDetailsFromSession();
        if (user != null && data != null)
        {
            return CannedRequestService.AddOrEditCannedReq(data, user);
        }
        return null;
    }


    [HttpPut]
    [Route("updatecannedReq")]
    public object Update()
    {
        UserModel user = AuthenticateUser.GetUserDetailsFromSession();
        CannedRequestModel data = Utility.GetDataFromBody<CannedRequestModel>(HttpContext);
        if (user != null && data != null)
        {
                return CannedRequestService.AddOrEditCannedReq(data, user);
            }
        return null;
    }

        [HttpDelete]
    [Route("deletecannedReq/{id}")]
    public object DeleteCannedReq(string id)
    {
        UserModel user = AuthenticateUser.GetUserDetailsFromSession();
        if (user != null && !string.IsNullOrWhiteSpace(id))
        {
            return CannedRequestService.DeleteCannedReq(user, id);

        }
        return null;
    }

    [HttpPost]
    [Route("getcannedReq")]
    public object GetCannedReq()
    {
        UserModel user = AuthenticateUser.GetUserDetailsFromSession();
        GridModel grid = Utility.GetDataFromBody<GridModel>(HttpContext);
        if (user != null && grid != null)
        {
            return CannedRequestService.GetCannedReq(user, grid);

        }
        return null;
    }
}
}
