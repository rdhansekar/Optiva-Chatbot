using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CommonUtility
{
    public class Utility
    {
        public static string StringToBase64(string text)
        {
            if (!string.IsNullOrWhiteSpace(text))
            {
                try
                {
                    return Convert.ToBase64String(Encoding.UTF8.GetBytes(text));
                }
                catch (Exception e)
                {
                    Logger.Log(e);
                }
            }
            return text;
        }

        public static string Base64ToString(string encodedString)
        {
            if (!string.IsNullOrWhiteSpace(encodedString))
            {
                try
                {
                    byte[] data = Convert.FromBase64String(encodedString);
                    string decodedString = Encoding.UTF8.GetString(data);
                    return decodedString;
                }
                catch (Exception e)
                {
                    Logger.Log(e);
                }
            }
            return encodedString;
        }


        public static string OneWayEncryptString(string str)
        {
            if (!string.IsNullOrWhiteSpace(str))
            {
                using (var algorithm = SHA512.Create())
                {
                    var hashedBytes = algorithm.ComputeHash(Encoding.UTF8.GetBytes(str));

                    return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
                }
            }
            return str;
        }

        public static T GetDataFromBody<T>(HttpContext context)
        {
            try
            {
                using (var reader = new StreamReader(context.Request.Body))
                {
                    string content = reader.ReadToEndAsync().Result;
                    reader.Close();
                    if (!string.IsNullOrWhiteSpace(content))
                    {
                        return JsonConvert.DeserializeObject<T>(content);
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return default(T);
        }

        public static string Post(string url, string body, WebHeaderCollection header)
        {
            try
            {
                using (var client = new WebClient())
                {
                    client.Headers = header;
                    string data = client.UploadString(url, body);
                    return data;
                }
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return null;
        }

        public static string Get(string url,  WebHeaderCollection header)
        {
            try
            {
                using (var client = new WebClient())
                {
                    client.Headers = header;
                    string data = client.DownloadString(url);
                    return data;
                }
            }
            catch (Exception e)
            {
                Logger.Log(e);
            }
            return null;
        }

    }
}
