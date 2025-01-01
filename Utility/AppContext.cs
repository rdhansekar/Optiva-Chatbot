using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Optiva
{
    public static class AppContext
    {
        private static IHttpContextAccessor _httpContextAccessor;

        private static IWebHostEnvironment _hostEnvironment;

        public static void Configure(IHttpContextAccessor httpContextAccessor, IWebHostEnvironment env)
        {
            _httpContextAccessor = httpContextAccessor;
            _hostEnvironment = env;
        }

        public static HttpContext Current => _httpContextAccessor.HttpContext;

        public static ThreadLocal<HttpContext> LocalStorage = new ThreadLocal<HttpContext>();

        public static string ContentRootPath => _hostEnvironment.ContentRootPath;

        public static string WebRootPath => _hostEnvironment.WebRootPath;

        public static bool IsLocal(this HttpRequest req)
        {
            var connection = req.HttpContext.Connection;
            if (connection.RemoteIpAddress != null)
            {
                if (connection.LocalIpAddress != null)
                {
                    return connection.RemoteIpAddress.Equals(connection.LocalIpAddress);
                }
                else
                {
                    return IPAddress.IsLoopback(connection.RemoteIpAddress);
                }
            }

            // for in memory TestServer or when dealing with default connection info
            if (connection.RemoteIpAddress == null && connection.LocalIpAddress == null)
            {
                return true;
            }

            return false;
        }

      
    }
}
