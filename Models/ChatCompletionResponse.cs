using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class ContentFilterResults
    {
        public FilterResult hate { get; set; }
        public FilterResult self_harm { get; set; }
        public FilterResult sexual { get; set; }
        public FilterResult violence { get; set; }
    }

    public class FilterResult
    {
        public bool filtered { get; set; }
        public string severity { get; set; }
    }


    public class Choice
    {
        public ContentFilterResults content_filter_results { get; set; }
        public string finish_reason { get; set; }
        public int index { get; set; }
        public object logprobs { get; set; }
        public MessageModel message { get; set; }
    }

    public class PromptFilterResults
    {
        public int prompt_index { get; set; }
        public ContentFilterResults content_filter_results { get; set; }
    }

    public class Usage
    {
        public int completion_tokens { get; set; }
        public int prompt_tokens { get; set; }
        public int total_tokens { get; set; }
    }

    public class ChatCompletionResponse
    {
        public List<Choice> choices { get; set; }
        public long created { get; set; }
        public string id { get; set; }
        public string model { get; set; }
        public string @object { get; set; }
        public List<PromptFilterResults> prompt_filter_results { get; set; }
        public object system_fingerprint { get; set; }
        public Usage usage { get; set; }
        public QNAModel model_response { get; set; }
    }

    public class QNAModel
    {
        public string content { get; set; }
        public string role { get; set; }
        public string function_call { get; set; } = "";
        public dynamic tool_calls { get; set; }
    }

    public class ContentModel
    {
        public string usermessageintent { get; set; }
        public string bestreply { get; set; }
        public string replyintent { get; set; } = "";
        public dynamic travellingto { get; set; }
        public string numberofdaystravelling { get; set; }
        public string datarequired { get; set; }
        public string voiceminutesrequired { get; set; }
        public string confirmed {get;set;}
        public dynamic extraInfo {get;set;}
        public string packageName {get;set;}
    }

}
