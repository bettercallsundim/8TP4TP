#include <bits/stdc++.h>
using namespace std;
int main()
{
  int t;
  cin >> t;
  while (t--)
  {
    long  double x1, y1, x2, y2;
    cin >> x1 >> y1 >> x2 >> y2;
    double mid=x1+x2/2.0;
    double  f1 = sqrt(pow(mid-x1,2) + pow(y1,2));
    double  f2 = sqrt(pow(x2-mid,2) + pow(y2,2));
    long double res=f1+f2;
    cout << f1 << endl;
    cout << f2 << endl;
    cout<<rw
  }
}