# print("Hello~")
import os
from docx import Document
import re
from collections import Counter
import pandas as pd

def handleOptions(text) :
    options = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'I.', 'J.', 'K.', 'L.', 'A:', 'B:', 'C:', 'D:', 'E:', 'F:', 'G:', 'H:', 'I:', 'J:', 'K:', 'L:']
    for option in options:
        text = text.replace(option, '')
    return text

def handleClass(text) :
    classes = [' adj.', ' art.', ' conj.', ' det.', ' pron.', ' prep.', ' adv.', ' vt.', ' vi.', ' num.', ' n.', ' v.'] # n./v. 放在后面避免先于 pron./adv.匹配 
    for item in classes:
        text = text.replace(item, '')
    return text

folderPath = './uploads/'
files = [file for file in os.listdir(folderPath)]
# print(files)

for file in files:
    fullText = []
    # print(folderPath + file)
    document = Document(folderPath + file)
    for para in document.paragraphs:
        fullText.append(para.text)
    original = '\n'.join(fullText)

    # print(original)
    # optionRemoved = handleOptions(original)
    # classRemoved = handleClass(optionRemoved) # 移除词性
    # phoneticRemoved = re.sub("\/.*\/", "", classRemoved) # 移除音标内容
    # # print(phoneticRemoved)
    # keepWords = re.findall("([A-Za-z]+(-|‘|')?(?(1)[a-zA-Z]+|[a-zA-Z]*))", phoneticRemoved)
    # # print(keepWords)
    # words = [word[0] for word in keepWords]
    # wordList = [word.lower() for word in words if not (len(word) == 1 and word not in ['a', 'i', 'A', 'I'])]


    # res = Counter(wordList).most_common()
    # # print(keepWords)

    # df = pd.DataFrame(res)
    # # print(df.loc[df[0] == 'a', 1].iloc[0]-df.loc[df[0] == 'b', 1].iloc[0]) # 减去B在题干中的频率
    # # df.at()
    # df = df.set_axis(['单词','词频'],axis = 'columns',copy=False)

    # writer=pd.ExcelWriter(f'/count-output/temp.xlsx')
    # df.to_excel(writer,sheet_name='result',index=False)
    # writer.close()