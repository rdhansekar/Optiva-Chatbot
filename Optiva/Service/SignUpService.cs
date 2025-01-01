using Models;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Primitives;
using CommonUtility;

namespace Optiva.Service
{
    public class SignUpService
    {
        public static string AddUser(UserModel user)
        {
            if (user != null)
            {
                try
                {
                    if (!string.IsNullOrWhiteSpace(user.EmailId) && !string.IsNullOrWhiteSpace(user.FirstName))
                    {
                        user.CreatedDate = DateTime.UtcNow;
                        user.Id = Guid.NewGuid().ToString();
                        user.Status = "InActive";
                        user.Password = Utility.OneWayEncryptString(user.Password);
                        Settings.mongoUtility.executeQeuryForInsert<UserModel>(new List<UserModel>() { user }, "users");
                        SendVerificationMail(user);
                        return ResponseModel.getResponse(true, "Success", null);
                    }
                    else
                    {
                        return ResponseModel.getResponse(false, "Email ID exists", null);
                    }
                }
                catch (Exception e)
                {
                    Logger.Log(e);
                }
            }
            return ResponseModel.getResponse(false, "Sorry!! Creating account failed.Please try again.If you face issue please write to contact@nlshelp.com", null);
        }

        internal static string SendVerificationMail(StringValues email)
        {
            FilterDefinitionBuilder<UserModel> filterBuilder = new FilterDefinitionBuilder<UserModel>();
            var filter = filterBuilder.Eq(x => x.EmailId, email.ToString());
            long totalRows = 0;
            List<UserModel> user = Settings.mongoUtility.executeQeuryForData<UserModel>(filter, null, "users",ref totalRows);
            if(user!=null && user.Count > 0)
            {
                SendVerificationMail(user[0]);
                return "Verification Mail sent successfully";
            }
            return "Couldnt find Email address";
        }

        public static bool VerifyAccount(string id)
        {
            if (!string.IsNullOrWhiteSpace(id))
            {
                try
                {
                    FilterDefinition<BsonDocument> filter = new FilterDefinitionBuilder<BsonDocument>().Eq("_id", id);
                    return Settings.mongoUtility.executeQeuryForUpdateOne("users", new BsonDocument() { { "status", "Active" } }, filter) > 0;
                }
                catch (Exception e)
                {
                    Logger.Log(e);
                }
            }
            return false;
        }

        public static bool IsEmailIdExists(string emailAddr)
        {
            if (!string.IsNullOrWhiteSpace(emailAddr))
            {
                try
                {
                    FilterDefinition<UserModel> filter = new FilterDefinitionBuilder<UserModel>().Regex(x => x.EmailId, emailAddr);
                    return Settings.mongoUtility.executeQeuryForCount<UserModel>(filter, "users") > 0;
                }
                catch (Exception e)
                {
                    Logger.Log(e);
                }
            }
            return true;
        }

        private static void SendVerificationMail(UserModel user)
        {
            try
            {
                string html = @"<table style='border: 1px solid #e6c0c0;background:#eaeaea;font-size: 13px;background: #eaeaea;'>
                             <tbody>
		                        <tr>
			                        <td style='padding: 27px;'>
				                        <p>Hi {0},</p>
				                        <p>Thanks for registering <b>BIOSTAR</b>! Please confirm your email address by clicking on the link below.<br/>
				                        We'll communicate with you from time to time via email so it's important that we have an up-to-date<br/>
				                        email address on file.</p>
				                        <p><a href='{1}' target='_blank' style='text-align: center;font-size: 20px;'>Verify Now</a></p>
				                        <p style='font-size:11px'>Note: If you did not sign up for a <b>BIOSTAR</b> account please disregard this email.</p>
			                        </td>
		                        </tr>
	                        </tbody>
                        </table>";
                string actiationMail = Settings.BaseUrl + "/session/verifyEmail?id=" + user.Id;
                html = string.Format(html, user.FirstName, actiationMail);
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
        }

    }
}
