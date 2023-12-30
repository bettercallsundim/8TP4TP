#include <bits/stdc++.h>

using namespace std;

int main()
{
  long long int n;
  cin >> n;
  long long int pos = 0;
  long long int neg = 0;
  map<long long int, long long int> arr;
  long long int sum = 0;
  for (auto i = 0; i < n; i++)
  {
    long long int x, y;
    cin >> x >> y;
    arr[x] = y;
    if (x > 0)
    {
      pos++;
    }
    else
    {
      neg++;
    }
    sum += arr[x];
  }

  if (pos == neg)
  {
    cout << sum << endl;
  }
  else if (pos > neg)
  {
    sum = 0;
    for (const auto &pair : arr)
    {

      if (pair.first < 0)
      {
        sum += pair.second;
      }
    }
    long long int negC = neg + 1;
    for (const auto &pair : arr)
    {

      if (pair.first > 0 && negC)
      {
        sum += pair.second;
        negC--;
      }
    }
    cout << sum << endl;
  }
  else
  {

    sum = 0;
    for (const auto &pair : arr)
    {
      if (pair.first > 0)
      {
        sum += pair.second;
      }
    }
    long long int posC = pos + 1;
    for (const auto &pair : arr)
    {

      if (pair.first < 0 && posC)
      {
        sum += pair.second;
        posC--;
      }
    }
    cout << sum << endl;
  }
}
