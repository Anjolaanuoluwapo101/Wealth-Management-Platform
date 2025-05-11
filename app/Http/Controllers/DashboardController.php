<?php

namespace App\Http\Controllers;

use App\Models\MutualFund;
use App\Models\OtherAsset;
use App\Models\FixedIncome;
use App\Models\Insurance;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function fetchData(Request $request)
    {
        $userId = $request->user()->id;
        return response()->json([
            'mutualFunds' => MutualFund::where('user_id', $userId)->get(),
            'otherAssets' => OtherAsset::where('user_id', $userId)->get(),
            'fixedIncomes' => FixedIncome::where('user_id', $userId)->get(),
            'insurances' => Insurance::where('user_id', $userId)->get(),
        ]);
    }

    public function save(Request $request)
    {
        $userId = $request->user()->id;
        try {
            foreach ($request->mutualFunds as $fund) {
                MutualFund::updateOrCreate(['id' => $fund['id'] ?? null], array_merge($fund, ['user_id' => $userId]));
            }
            foreach ($request->otherAssets as $asset) {
                OtherAsset::updateOrCreate(['id' => $asset['id'] ?? null], array_merge($asset, ['user_id' => $userId]));
            }
            foreach ($request->fixedIncomes as $income) {
                FixedIncome::updateOrCreate(['id' => $income['id'] ?? null], array_merge($income, ['user_id' => $userId]));
            }
            foreach ($request->insurances as $insurance) {
                Insurance::updateOrCreate(['id' => $insurance['id'] ?? null], array_merge($insurance, ['user_id' => $userId]));
            }
            return response()->json(['message' => 'Data saved successfully']);
        }catch(\Exception $e){
            return  "Error:".$e->getMessage();
        }
    }

    public function get(Request $request){
        try{
            //since we are dealing with small data
            //Ideally this should be 
            return response()->json([
                'mutualFunds' => MutualFund::all(),
                'otherAssets' => OtherAsset::all(),
                'fixedIncomes' => FixedIncome::all(),
                'insurances' => Insurance::all()
            ]);
        }catch(\Exception $e){
            return "Error:".$e->getMessage();
        }
    }

    public function delete($type, $id)
    {
        try {
            switch ($type) {
                case 'mutualFunds':
                    MutualFund::where('id', $id)->delete();
                    break;
                case 'otherAssets':
                    OtherAsset::where('id', $id)->delete();
                    break;
                case 'fixedIncomes':
                    FixedIncome::where('id', $id)->delete();
                    break;
                case 'insurances':
                    Insurance::where('id', $id)->delete();
                    break;
                default:
                    return response()->json(['error' => 'Invalid type'], 400);
            }
            return response()->json(['message' => 'Item deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete item: ' . $e->getMessage()], 500);
        }
    }
}