
using Models;

public class OpenAIChatModel
{
    public List<MessageModel> messages;
    public double temperature = 0.5;
    public double top_p = 0.95;
    public int frequency_penalty = 0;
    public int presence_penalty = 0;
    public int max_tokens = 800;
    public dynamic stop = null;
}