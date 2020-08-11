from bs4 import BeautifulSoup
import urllib.request

def get_url(acadyear, acadsem):
    return f"https://wish.wis.ntu.edu.sg/webexe/owa/AUS_SCHEDULE.main_display1?acadsem={acadyear};{acadsem}&staff_access=true&r_search_type=F&boption=Search&r_subj_code="



if __name__ == "__main__":

    url = get_url(2020, 1)

    with urllib.request.urlopen(url) as fp:
        soup = BeautifulSoup(fp, "lxml")

    print(soup)