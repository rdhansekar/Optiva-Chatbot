using Models;
using CommonUtility;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Optiva.Service
{
    public class LoginService
    {
        public static string ValidateLogin(string userName, string password, HttpContext context)
        {
            if (!string.IsNullOrWhiteSpace(userName) && !string.IsNullOrWhiteSpace(password))
            {
                try
                {
                    string decodedUserName = Utility.Base64ToString(userName);
                    string decodedPassword = Utility.Base64ToString(password);
                    FilterDefinitionBuilder<UserModel> filterBuilder = new FilterDefinitionBuilder<UserModel>();
                    decodedPassword = Utility.OneWayEncryptString(decodedPassword);
                    var filter = filterBuilder.Eq(x => x.EmailId, decodedUserName)
                                 & filterBuilder.Eq(x => x.Password, decodedPassword)
                                & filterBuilder.Eq(x => x.UserType, "Admin");
                    long totalRows = 0;
                    List<UserModel> user = Settings.mongoUtility.executeQeuryForData<UserModel>(filter, null, "users", ref totalRows);
                    if (user != null && user.Count > 0)
                    {
                        if (user[0].Status == "Active")
                        {
                            AuthenticateUser.SaveUserInSession(Newtonsoft.Json.JsonConvert.SerializeObject(user[0]));
                            return ResponseModel.getResponse(true, "Success", Newtonsoft.Json.JsonConvert.SerializeObject(user[0]));
                        }
                        else
                        {
                            return ResponseModel.getResponse(false, "Please check your email, and Activate your Account.Note: if you didn’t get an email, check your SPAM folder or Click ", 0);
                        }
                    }
                }
                catch (Exception e)
                {
                    Logger.Log(e);
                }
            }
            return ResponseModel.getResponse(false, "Invalid username or password", 1);
        }

        internal static string SetNewPassword(string id, string newPassword)
        {
            if (!string.IsNullOrWhiteSpace(id) && !string.IsNullOrWhiteSpace(newPassword))
            {
                try
                {
                    FilterDefinitionBuilder<ForgotPasswordModel> filterBuilder1 = new FilterDefinitionBuilder<ForgotPasswordModel>();
                    var filter1 = filterBuilder1.Eq(x => x.Id, id);
                    long totalRows = 0;
                    List<ForgotPasswordModel> details = Settings.mongoUtility.executeQeuryForData<ForgotPasswordModel>(filter1, null, "forgotpasswordresetlink", ref totalRows);
                    if (details == null || details.Count > 0)
                    {
                        BsonDocument data = new BsonDocument() { { "password", newPassword } };
                        var filter = new FilterDefinitionBuilder<BsonDocument>().Eq("email_id", details[0].EmailId);
                        long updated = Settings.mongoUtility.executeQeuryForUpdateOne("users", data, filter);

                        //delete from frgtpswd reset collection
                        filter = new FilterDefinitionBuilder<BsonDocument>().Eq("_id", id);
                        Settings.mongoUtility.executeQueryForDeleteOne(filter, "forgotpasswordresetlink");

                        if (updated > 0)
                        {
                            return ResponseModel.getResponse(true, "Password reset", null);
                        }
                    }
                }
                catch (Exception e)
                {
                    Logger.Log(e);
                }
            }

            return ResponseModel.getResponse(false, "Invalid request", null);
        }

        internal static bool IsValidResetRequest(string id)
        {
            try
            {
                FilterDefinitionBuilder<ForgotPasswordModel> filterBuilder1 = new FilterDefinitionBuilder<ForgotPasswordModel>();
                var filter1 = filterBuilder1.Eq(x => x.Id, id);
                long totalRows = 0;
                List<ForgotPasswordModel> details = Settings.mongoUtility.executeQeuryForData<ForgotPasswordModel>(filter1, null, "forgotpasswordresetlink", ref totalRows);
                if (details == null || details.Count > 0)
                {
                    return true;
                }
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return false;
        }

        internal static string VerifyAccountAndSendResetMail(string emailId)
        {
            if (!string.IsNullOrWhiteSpace(emailId))
            {
                try
                {
                    long totalRows = 0;
                    FilterDefinition<UserModel> filter = new FilterDefinitionBuilder<UserModel>().Regex(x => x.EmailId, emailId);
                    List<UserModel> user = Settings.mongoUtility.executeQeuryForData<UserModel>(filter, null, "users", ref totalRows);
                    if (user != null && user.Count > 0)
                    {
                        FilterDefinitionBuilder<ForgotPasswordModel> filterBuilder1 = new FilterDefinitionBuilder<ForgotPasswordModel>();
                        var filter1 = filterBuilder1.Eq(x => x.EmailId, emailId);
                        List<ForgotPasswordModel> details = Settings.mongoUtility.executeQeuryForData<ForgotPasswordModel>(filter1, null, "forgotpasswordresetlink", ref totalRows);
                        if (details == null || details.Count == 0)
                        {
                            details = new List<ForgotPasswordModel>(){
                            new ForgotPasswordModel() {
                                EmailId = emailId,
                                Id = Guid.NewGuid().ToString(),
                                DateTime = DateTime.UtcNow,
                                FirstName = user[0].FirstName
                            }
                        };
                            Settings.mongoUtility.executeQeuryForInsert<ForgotPasswordModel>(details, "forgotpasswordresetlink");
                        }
                        SendForgotPasswordAlertMail(details[0]);
                        return ResponseModel.getResponse(true, "Password reset mail is sent to your email address. Please follow the steps mentioned in mail", "");
                    }
                }
                catch (Exception e)
                {
                    Logger.Log(e);
                }
            }
            return ResponseModel.getResponse(false, "Email address is not registered. New User ??! Please register.", "");
        }

        private static void SendForgotPasswordAlertMail(ForgotPasswordModel forgotPasswordModel)
        {
            try
            {
                string html = @"<table style='border: 1px solid #e6c0c0;background:#eaeaea;font-size: 13px;background: #eaeaea;'>
                             <tbody>
		                        <tr>
			                        <td style='padding: 27px;'>
				                        <p>Hi {0},</p>
				                        <p>Please click on below link to reset your password</p>
				                        <p><a href='{1}' target='_blank' style='text-align: center;font-size: 20px;'>Reset Now</a></p>
				                        <p style='font-size:11px'>Note: If you did not request for password reset please disregard this email.</p>
			                        </td>
		                        </tr>
	                        </tbody>
                        </table>";
                string actiationMail = Settings.BaseUrl + "/session/resetpassword?id=" + forgotPasswordModel.Id;
                html = string.Format(html, forgotPasswordModel.FirstName, actiationMail);
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
        }
    }
}
