import math
t = int(input())
for x in range(t):
    n = int(input())
    ss = input()
    res = []
    C = "bcd"
    V = "ae"
    strt = 0
    ff=ba,ca,da,be,ce,de,
    sf=bab,bac,bad,cab,cac,cad,dab,dac,dad,beb,bec,bed,ceb,cec,ced,deb,dec,de
    for y in range(strt, n):
        temp = ss[y:y+2]
        temp2 = ss[y+2:y+5]
        if ((len(temp) == 2 and temp[0] in C and temp[1] in V) and (len(temp2) == 3 and temp2[0] in C and temp2[1] in V and temp2[2] in C)):
            res.append(temp)
            strt += 2
            continue
        else:
            strt += 3
            res.append(temp2)
            continue

    print(res)
