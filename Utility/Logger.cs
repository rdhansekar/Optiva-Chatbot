using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections.Concurrent;
using System.Threading;
using Newtonsoft.Json;

namespace CommonUtility
{
    public class Logger
    {
        private static List<string> Logs = new List<string>();

        public static void Log(string messg)
        {
            try
            {
                Logs.Add(Thread.CurrentThread.ManagedThreadId + " ~ " + DateTime.UtcNow.ToString() + " ~ " + messg);
            }
            catch (Exception)
            {
            }
        }

        public static void Log(string messg, Exception e)
        {
            try
            {
                Logs.Add(Thread.CurrentThread.ManagedThreadId + " ~ " + DateTime.UtcNow.ToString() + " ~ " + messg + " \n Exception : " + e.ToString());
            }
            catch (Exception)
            {
            }
        }

        public static void Log(Exception e)
        {
            try
            {
                Logs.Add(Thread.CurrentThread.ManagedThreadId + " ~ " + DateTime.UtcNow.ToString() + " ~ " + e.ToString());
            }
            catch (Exception)
            {
            }
        }

        private static void TruncateOldLogs()
        {
            if (Logs.Count > 2000)
            {
                Logs.RemoveRange(0, Logs.Count - 2000);
            }
        }

        public static string GetLogs()
        {
            if(Logs.Count > 0)
            {
                string mesg = string.Join("\n", Logs);
                Logs.Clear();
                return JsonConvert.SerializeObject(mesg);
            }
            return "";
        }
    }
}