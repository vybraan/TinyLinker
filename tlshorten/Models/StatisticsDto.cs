namespace tlshorten.Models;

public class StatisticsDto
{
    public int TotalLinksShortened { get; set; }
    public int TotalClicks { get; set; }
    public double AverageClicksPerLink { get; set; }
    public string MostClickedOriginalUrl { get; set; }
    public string MostClickedShortUrl { get; set; }
    public int MostClickedCount { get; set; }
}

