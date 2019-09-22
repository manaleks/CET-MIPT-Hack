
import pandas as pd
import numpy as np
import sklearn 
import catboost

from catboost import CatBoostClassifier

def predict(features, id_, thrashhold=0.1831592068886578):
    #df = pd.read_excel('train_first.xlsx')
    #test_df = pd.read_excel('test.xlsx')

    df = pd.read_excel('data/train.xlsx')
    test_df = pd.read_excel('data/test.xlsx')

    

    costs = {}
    costs['bk'] = 2450
    costs['GZ1'] = 2050
    costs['GZ2'] = 2050
    costs['GZ3'] = 2050
    costs['GZ4'] = 2050
    costs['GZ5'] = 2050
    costs['GZ7'] = 2050
    costs['DGK'] = 1300
    costs['NKTD'] = 2050
    costs['NKTM'] = 2050
    costs['NKTR'] = 2050
    costs['ALPS'] = 1150

    corotages = ['bk', 'GZ1', 'GZ2', 'GZ3', 'GZ4', 'GZ5', 'GZ7', 'DGK', 'NKTD', 'NKTM', 'NKTR', 'ALPS']
    
    DELTA = 0.08950000000004366

    df_no_null = df.copy()
    df_no_null[corotages] = df_no_null[corotages].apply(lambda x: x.fillna(x.mean()), axis=0)
    train = df_no_null.copy()

    df_no_null = test_df.copy()
    df_no_null[corotages] = df_no_null[corotages].apply(lambda x: x.fillna(x.mean()), axis=0)
    test = df_no_null.copy()

    X_train = train.copy()
    X_train.drop('lith', axis=1, inplace=True)
    X_train.drop('goal', axis=1, inplace=True)
    X_train.drop('well id', axis=1, inplace=True)
    y_train = train['goal'].copy()
    y_lith_train = train['lith'].copy()
    
    X_test = test.copy()
    ids = test['id'].copy()
    X_test.drop('id', axis=1, inplace=True)

    for item in corotages:
        if item not in features:
            X_train.drop(item, axis=1, inplace=True)
            X_test.drop(item, axis=1, inplace=True)

    #OPTIMAL:
    #model = CatBoostClassifier(iterations=500,
    #                           learning_rate=0.01,
    #                           depth=10, custom_metric='F1', random_seed=19)

    model = CatBoostClassifier(iterations=1,
                              learning_rate=0.1,
                              depth=5, custom_metric='F1', random_seed=19)
    model.fit(X_train, y_train)

    model_lith = CatBoostClassifier(iterations=2,
                              learning_rate=0.01,
                              depth=10)
    model_lith.fit(X_train, y_lith_train)
    lith_preds = model_lith.predict(X_test)

    probs = model.predict_proba(X_test)

    preds = np.copy(probs[:,1])
    preds[preds < thrashhold] = 0
    preds[preds >= thrashhold] = 1
    
    test['goal'] = preds
    test['lith'] = lith_preds
    
    res = {}
    for i in range(len(preds)):
        res[ids[i]] = preds[i]

    res_lith = {}
    for i in range(len(lith_preds)):
        res_lith[ids[i]] = lith_preds[i]



    #results = pd.read_excel('result.xlsx')
    results = pd.read_excel('data/result.xlsx')
    

    for i in range(len(results)):
        cur_id = results.iloc[i]['id']
        results.loc[i, 'goal'] = res[cur_id]
        results.loc[i, 'lith'] = res_lith[cur_id]

    results.to_csv('data/submission.csv')
    test.to_csv('data/final.csv')

    col = int(len(preds) * 0.3)
    train_pred = model.predict(X_train[:col])


    total_money = 0
    other_money = 0
    for item in corotages:
        if item  in features:
            print (item)
            total_money += costs[item]
        else:
            other_money += costs[item]
    cnt = 0
    cnt1 = 0
    cnt2 = 0
    for i in range(col):
        if train_pred[i] == 1 and y_train.iloc[i] == 1:
            cnt += 1
        if train_pred[i] == 0 and y_train.iloc[i] == 1:
            cnt1 += 1
        if train_pred[i] == 1 and y_train.iloc[i] == 0:
            cnt2 += 1
     
    return round(-col * total_money * DELTA - other_money * (cnt1 + cnt2)* DELTA + DELTA * cnt  * 0.7 * 100 * 860 * 4.15 )